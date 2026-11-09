import { PreparationPlan, PreparationChecklistItem } from '@shared/types';

const STORAGE_KEYS = {
  PLANS: 'scholarsteps:v1:plans',
  PREFERENCES: 'scholarsteps:v1:preferences',
  QUESTIONNAIRE: 'scholarsteps:v1:draft_answers',
};

// Node test environment in-memory store (active ONLY outside browser environment)
const nodeTestStore = new Map<string, string>();

export class StorageService {
  private static getBackend(): {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  } | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const test = '__storage_test__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return window.localStorage;
      } catch (e) {
        return null; // Do NOT silently replace failed browser storage with memory in production
      }
    }

    // When running under Node.js CLI / Vitest test runner
    if (typeof window === 'undefined') {
      return {
        getItem: (k: string) => nodeTestStore.get(k) ?? null,
        setItem: (k: string, v: string) => {
          nodeTestStore.set(k, v);
        },
        removeItem: (k: string) => {
          nodeTestStore.delete(k);
        },
      };
    }

    return null;
  }

  static getPlans(): PreparationPlan[] {
    const backend = this.getBackend();
    if (!backend) return [];
    try {
      const raw = backend.getItem(STORAGE_KEYS.PLANS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Failed to parse stored plans', err);
      return [];
    }
  }

  static getPlanById(id: string): PreparationPlan | undefined {
    const plans = this.getPlans();
    return plans.find((p) => p.id === id);
  }

  static getPlanByScholarshipId(scholarshipId: string): PreparationPlan | undefined {
    const plans = this.getPlans();
    return plans.find((p) => p.scholarshipId === scholarshipId);
  }

  static savePlan(plan: PreparationPlan): { success: boolean; error?: string } {
    const backend = this.getBackend();
    if (!backend) {
      return { success: false, error: 'Browser localStorage is disabled or unavailable.' };
    }
    try {
      const plans = this.getPlans();
      const existingIndex = plans.findIndex((p) => p.id === plan.id);
      if (existingIndex >= 0) {
        plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() };
      } else {
        plans.unshift({ ...plan, updatedAt: new Date().toISOString() });
      }
      backend.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Storage write failed.' };
    }
  }

  static updateChecklistItem(
    planId: string,
    itemId: string,
    status: PreparationChecklistItem['status'],
    note?: string
  ): { success: boolean; updatedPlan?: PreparationPlan; error?: string } {
    const plan = this.getPlanById(planId);
    if (!plan) {
      return { success: false, error: 'Plan not found.' };
    }

    const itemIndex = plan.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found in plan.' };
    }

    const updatedItems = [...plan.items];
    const currentItem = updatedItems[itemIndex];
    updatedItems[itemIndex] = {
      ...currentItem,
      status,
      note: note !== undefined ? note : currentItem.note,
      markedReadyAt: status === 'READY' ? new Date().toISOString() : undefined,
    };

    const updatedPlan: PreparationPlan = {
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    const result = this.savePlan(updatedPlan);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, updatedPlan };
  }

  static updatePlanNotes(
    planId: string,
    notes: string
  ): { success: boolean; updatedPlan?: PreparationPlan; error?: string } {
    const plan = this.getPlanById(planId);
    if (!plan) return { success: false, error: 'Plan not found' };

    const updatedPlan: PreparationPlan = {
      ...plan,
      userNotes: notes,
      updatedAt: new Date().toISOString(),
    };

    const res = this.savePlan(updatedPlan);
    if (!res.success) return { success: false, error: res.error };
    return { success: true, updatedPlan };
  }

  static deletePlan(planId: string): { success: boolean } {
    const backend = this.getBackend();
    if (!backend) return { success: false };
    try {
      const plans = this.getPlans().filter((p) => p.id !== planId);
      backend.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }

  static clearAllData(): { success: boolean } {
    const backend = this.getBackend();
    if (!backend) return { success: false };
    try {
      backend.removeItem(STORAGE_KEYS.PLANS);
      backend.removeItem(STORAGE_KEYS.PREFERENCES);
      backend.removeItem(STORAGE_KEYS.QUESTIONNAIRE);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }

  static saveDraftAnswers(answers: Record<string, any>): void {
    const backend = this.getBackend();
    if (!backend) return;
    try {
      backend.setItem(STORAGE_KEYS.QUESTIONNAIRE, JSON.stringify(answers));
    } catch {}
  }

  static getDraftAnswers(): Record<string, any> {
    const backend = this.getBackend();
    if (!backend) return {};
    try {
      const raw = backend.getItem(STORAGE_KEYS.QUESTIONNAIRE);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  static clearDraftAnswers(): void {
    const backend = this.getBackend();
    if (!backend) return;
    try {
      backend.removeItem(STORAGE_KEYS.QUESTIONNAIRE);
    } catch {}
  }
}
