import bcrypt from 'bcryptjs';
import reviewedScholarships from '../../../fixtures/reviewed/scholarships.json';
import syntheticScholarships from '../../../fixtures/synthetic/sample-scholarships.json';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: 'STUDENT' | 'EDITOR' | 'ADMIN' | 'ADVISOR';
  emailVerified: boolean;
  createdAt: string;
}

export interface SessionEntity {
  id: string;
  userId: string;
  token: string;
  csrfToken: string;
  expiresAt: string;
}

export interface ProfileEntity {
  userId: string;
  domicileState?: string;
  studyLevel?: string;
  courseGroup?: string;
  academicYear?: string;
  preferences?: Record<string, any>;
}

// In-Memory store for DATA_MODE=demo
class DemoDataStore {
  users: Map<string, UserEntity> = new Map();
  sessions: Map<string, SessionEntity> = new Map();
  profiles: Map<string, ProfileEntity> = new Map();
  savedScholarships: Map<string, Set<string>> = new Map(); // userId -> Set of scholarshipIds
  plans: Map<string, any[]> = new Map(); // userId -> Array of plans
  notifications: Map<string, any[]> = new Map(); // userId -> Array of notifications
  reports: any[] = [];
  auditEvents: any[] = [];
  resources: any[] = [
    {
      id: 'res-1',
      slug: 'understanding-rd-certificates',
      title: 'A Guide to Revenue RD Numbers for Karnataka Scholarships',
      category: 'Documentation',
      language: 'en',
      content: 'Atalji Janasnehi Kendra (Nemmadi Kendra) issues digitally signed caste and income certificates with a unique 15-digit RD reference code. State scholarship platforms query these servers directly for eligibility verification.',
      createdAt: '2026-10-10T00:00:00Z',
    },
    {
      id: 'res-2',
      slug: 'npci-aadhaar-seeding-guide',
      title: 'How to Verify NPCI Aadhaar Mapping for Direct Benefit Transfer',
      category: 'Banking',
      language: 'en',
      content: 'Aadhaar seeding is the process of linking your bank account to the NPCI database so that DBT payments from central and state ministries credit directly into your account without intermediate failure.',
      createdAt: '2026-10-12T00:00:00Z',
    },
    {
      id: 'res-3',
      slug: 'income-ceilings-and-documents',
      title: 'Common Family Income Thresholds in State Schemes',
      category: 'Eligibility',
      language: 'en',
      content: 'Most post-matric welfare schemes set gross family income ceilings (e.g. ₹2.5 Lakh for standard welfare categories, ₹8 Lakh for EBC/Pragati). Official Tahsildar certificates are mandatory.',
      createdAt: '2026-10-15T00:00:00Z',
    },
  ];

  constructor() {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    // Default student user
    const studentPass = bcrypt.hashSync('Student@123', 8);
    const studentUser: UserEntity = {
      id: 'usr-student-demo',
      email: 'student@example.com',
      passwordHash: studentPass,
      displayName: 'Arun Kumar',
      role: 'STUDENT',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    this.users.set(studentUser.id, studentUser);
    this.profiles.set(studentUser.id, {
      userId: studentUser.id,
      domicileState: 'Karnataka',
      studyLevel: 'UNDERGRADUATE',
      courseGroup: 'ENGINEERING',
      academicYear: '2026-27',
    });

    // Default admin user
    const adminPass = bcrypt.hashSync('Admin@123', 8);
    const adminUser: UserEntity = {
      id: 'usr-admin-demo',
      email: 'admin@scholarsteps.org',
      passwordHash: adminPass,
      displayName: 'Editorial Administrator',
      role: 'ADMIN',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initial notifications for student
    this.notifications.set(studentUser.id, [
      {
        id: 'notif-1',
        type: 'SOURCE_UPDATE',
        title: 'SSP Portal Deadline Notice',
        message: 'Karnataka SSP 2026 application cycle is verified open through Dec 31, 2026.',
        link: '/scholarships/ssp-karnataka-postmatric',
        readAt: null,
        createdAt: new Date().toISOString(),
      },
    ]);

    // Initial audit event
    this.auditEvents.push({
      id: 'audit-1',
      actorId: adminUser.id,
      action: 'PUBLISH_VERSION',
      entity: 'ssp-karnataka-postmatric-2026',
      createdAt: new Date().toISOString(),
      metadata: { version: 1, status: 'PUBLISHED' },
    });
  }

  getAllScholarships() {
    return [...(reviewedScholarships as any[]), ...(syntheticScholarships as any[])];
  }
}

export const demoStore = new DemoDataStore();
