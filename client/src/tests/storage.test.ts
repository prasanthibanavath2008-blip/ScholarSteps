import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../lib/storage';
import { PreparationPlan } from '@shared/types';

describe('StorageService: Browser Persistence', () => {
  beforeEach(() => {
    StorageService.clearAllData();
  });

  const mockPlan: PreparationPlan = {
    id: 'test-plan-1',
    scholarshipId: 'ssp-karnataka-postmatric-2026',
    scholarshipSlug: 'ssp-karnataka-postmatric',
    scholarshipName: 'Karnataka SSP Post-Matric Scheme',
    providerName: 'Social Welfare Dept, GoK',
    versionId: 1,
    cycleLabel: '2026-27',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    officialPortalUrl: 'https://ssp.postmatric.karnataka.gov.in/',
    items: [
      {
        id: 'item-1',
        title: 'Caste & Income RD Certificate',
        description: '15-digit RD number',
        requirementType: 'REQUIRED',
        applicability: 'APPLICABLE',
        status: 'NOT_STARTED',
      },
      {
        id: 'item-2',
        title: 'Aadhaar Bank Seeding',
        description: 'NPCI mapper active',
        requirementType: 'REQUIRED',
        applicability: 'APPLICABLE',
        status: 'NOT_STARTED',
      },
    ],
    sourceVersionCheckDate: new Date().toISOString(),
  };

  it('saves and retrieves preparation plans', () => {
    expect(StorageService.getPlans()).toEqual([]);

    const saveRes = StorageService.savePlan(mockPlan);
    expect(saveRes.success).toBe(true);

    const plans = StorageService.getPlans();
    expect(plans.length).toBe(1);
    expect(plans[0].id).toBe('test-plan-1');
  });

  it('updates checklist item status cleanly', () => {
    StorageService.savePlan(mockPlan);

    const updateRes = StorageService.updateChecklistItem('test-plan-1', 'item-1', 'READY');
    expect(updateRes.success).toBe(true);
    expect(updateRes.updatedPlan?.items[0].status).toBe('READY');
    expect(updateRes.updatedPlan?.items[0].markedReadyAt).toBeDefined();

    const retrieved = StorageService.getPlanById('test-plan-1');
    expect(retrieved?.items[0].status).toBe('READY');
  });

  it('updates plan user notes cleanly', () => {
    StorageService.savePlan(mockPlan);

    const noteRes = StorageService.updatePlanNotes('test-plan-1', 'RD number generated: RD1234567890123');
    expect(noteRes.success).toBe(true);
    expect(noteRes.updatedPlan?.userNotes).toBe('RD number generated: RD1234567890123');
  });

  it('deletes plan when requested', () => {
    StorageService.savePlan(mockPlan);
    expect(StorageService.getPlans().length).toBe(1);

    const delRes = StorageService.deletePlan('test-plan-1');
    expect(delRes.success).toBe(true);
    expect(StorageService.getPlans().length).toBe(0);
  });

  it('saves and retrieves draft questionnaire answers', () => {
    expect(StorageService.getDraftAnswers()).toEqual({});

    StorageService.saveDraftAnswers({ domicileState: 'Karnataka', studyLevel: 'UNDERGRADUATE' });
    const answers = StorageService.getDraftAnswers();
    expect(answers.domicileState).toBe('Karnataka');
    expect(answers.studyLevel).toBe('UNDERGRADUATE');

    StorageService.clearDraftAnswers();
    expect(StorageService.getDraftAnswers()).toEqual({});
  });
});

