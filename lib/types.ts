export interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  s3Key: string;
  url: string;
  isPrimary: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  uin: string;
  avatar: string;
  bio: string;
  degreeType: 'MS' | 'PhD' | 'MBA' | 'BS' | '';
  academicLevel: 'Graduate' | 'Undergraduate' | '';
  graduationYear: number | null;
  domainsOfInterest: string[];
  targetIndustries: string[];
  resumeUrl: string;
  resumes?: Resume[];
  needsMentor: boolean;
  isRegistered: boolean;
  mentor?: {
    name: string;
    email: string;
    company: string;
  };
  activityLog: ActivityLogEntry[];
  isCMISRegistered?: boolean;
}

export interface ActivityLogEntry {
  id: string;
  type: 'registration' | 'rsvp' | 'profile_update' | 'resume_upload';
  description: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  description: string;
  fullDescription: string;
  location: string;
  tags: string[];
  agenda?: string[];
  speakers?: Speaker[];
  attendees: string[]; // user IDs
  isPast: boolean;
}

export interface Speaker {
  name: string;
  title: string;
  company: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'event_registration' | 'event_reminder' | 'mentor_assigned' | 'profile_reminder' | 'resume_reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  icon: string;
}
