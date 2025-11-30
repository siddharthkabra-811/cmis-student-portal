import { User, Event, Notification } from './types';

export const dummyUsers: User[] = [
  {
    id: 'user_001',
    email: 'john.smith@tamu.edu',
    password: 'password123',
    fullName: 'John Smith',
    uin: '123456789',
    avatar: '/avatars/default-avatar.jpg',
    bio: 'Graduate student pursuing MS in Information Systems with a passion for data analytics and business intelligence. Interested in consulting and technology leadership roles.',
    degreeType: 'MS',
    academicLevel: 'Graduate',
    graduationYear: 2026,
    domainsOfInterest: ['Data Analytics', 'Business Intelligence', 'Cloud Computing', 'Cybersecurity'],
    targetIndustries: ['Technology', 'Consulting', 'Finance', 'Healthcare'],
    resumeUrl: '/uploads/dummy_resume.pdf',
    needsMentor: true,
    isRegistered: true,
    mentor: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@company.com',
      company: 'Deloitte Consulting'
    },
    activityLog: [
      {
        id: 'log_001',
        type: 'registration',
        description: 'Registered for CMIS student portal',
        timestamp: '2025-11-15T10:30:00Z'
      },
      {
        id: 'log_002',
        type: 'rsvp',
        description: 'RSVP\'d to Case Competition Workshop',
        timestamp: '2025-11-20T14:20:00Z'
      },
      {
        id: 'log_003',
        type: 'resume_upload',
        description: 'Uploaded resume',
        timestamp: '2025-11-22T09:15:00Z'
      },
      {
        id: 'log_004',
        type: 'rsvp',
        description: 'RSVP\'d to Guest Lecture: AI in Business',
        timestamp: '2025-11-25T16:45:00Z'
      }
    ]
  }
];

export const dummyEvents: Event[] = [
  {
    id: 'event_001',
    title: 'Guest Lecture: AI in Business',
    date: '2025-12-05',
    time: '6:00 PM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    description: 'Learn how AI is transforming business operations and decision-making from industry leaders.',
    fullDescription: 'Join us for an enlightening evening with leading AI practitioners from Fortune 500 companies. Discover how artificial intelligence is revolutionizing business processes, customer experiences, and strategic planning. This event features panel discussions, Q&A sessions, and networking opportunities.',
    location: 'Wehner Building, Room 115',
    tags: ['guest_lecture', 'ai', 'technology'],
    isPast: false,
    agenda: [
      '6:00 PM - Welcome & Introductions',
      '6:15 PM - Keynote: AI Transformation in Enterprise',
      '7:00 PM - Panel Discussion',
      '7:30 PM - Q&A Session',
      '7:50 PM - Networking'
    ],
    speakers: [
      {
        name: 'Dr. Michael Chen',
        title: 'Chief AI Officer',
        company: 'Microsoft'
      },
      {
        name: 'Rebecca Martinez',
        title: 'VP of Data Science',
        company: 'Amazon Web Services'
      }
    ],
    attendees: ['user_001']
  },
  {
    id: 'event_002',
    title: 'Case Competition Workshop',
    date: '2025-12-10',
    time: '5:00 PM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    description: 'Prepare for upcoming case competitions with expert coaching and practice sessions.',
    fullDescription: 'Get ready to excel in case competitions! This intensive workshop covers case analysis frameworks, presentation skills, and team collaboration strategies. Past winners will share their experiences and provide personalized feedback on your approach.',
    location: 'Mays Business School, Room 240',
    tags: ['case_competition', 'workshop', 'career_development'],
    isPast: false,
    agenda: [
      '5:00 PM - Workshop Introduction',
      '5:15 PM - Case Analysis Frameworks',
      '6:00 PM - Practice Case Session',
      '6:45 PM - Feedback & Tips'
    ],
    speakers: [
      {
        name: 'James Wilson',
        title: 'Strategy Consultant',
        company: 'McKinsey & Company'
      }
    ],
    attendees: ['user_001']
  },
  {
    id: 'event_003',
    title: 'Corporate Networking Night',
    date: '2025-12-12',
    time: '6:30 PM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
    description: 'Connect with recruiters and alumni from top companies in technology and consulting.',
    fullDescription: 'An exclusive networking event featuring representatives from leading companies actively hiring CMIS graduates. Dress professionally and bring copies of your resume. This is your opportunity to make meaningful connections and learn about internship and full-time opportunities.',
    location: 'Memorial Student Center, Ballroom',
    tags: ['networking', 'career', 'recruiting'],
    isPast: false,
    agenda: [
      '6:30 PM - Registration & Reception',
      '7:00 PM - Company Presentations',
      '7:45 PM - Speed Networking Sessions',
      '8:30 PM - Open Networking'
    ],
    speakers: [],
    attendees: []
  },
  {
    id: 'event_004',
    title: 'CMIS Career Fair',
    date: '2025-12-15',
    time: '10:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    description: 'Meet with 50+ companies looking to hire CMIS students for internships and full-time roles.',
    fullDescription: 'The premier recruiting event for CMIS students! Over 50 companies from diverse industries will be on campus to meet you. Whether you\'re looking for internships, full-time positions, or just want to explore career options, this fair has something for everyone.',
    location: 'Reed Arena',
    tags: ['career_fair', 'recruiting', 'networking'],
    isPast: false,
    agenda: [
      '10:00 AM - Fair Opens',
      '12:00 PM - Resume Review Sessions',
      '2:00 PM - Professional Headshots',
      '4:00 PM - Fair Closes'
    ],
    speakers: [],
    attendees: []
  },
  {
    id: 'event_005',
    title: 'Aggie Data Science Symposium',
    date: '2025-11-18',
    time: '9:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    description: 'A full-day symposium featuring the latest research and applications in data science.',
    fullDescription: 'Already completed - this symposium showcased cutting-edge research in machine learning, big data analytics, and AI applications. Students and faculty presented their work and engaged with industry partners.',
    location: 'Mays Business School',
    tags: ['data_science', 'research', 'symposium'],
    isPast: true,
    agenda: [],
    speakers: [],
    attendees: ['user_001']
  },
  {
    id: 'event_006',
    title: 'Fall CMIS Welcome Reception',
    date: '2025-11-01',
    time: '5:00 PM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop',
    description: 'Welcome reception for new CMIS students. Meet faculty, current students, and alumni.',
    fullDescription: 'This past welcome reception brought together the CMIS community for an evening of networking and celebration. New students met faculty members, connected with peers, and learned about program opportunities.',
    location: 'Wehner Building Atrium',
    tags: ['social', 'networking', 'welcome'],
    isPast: true,
    agenda: [],
    speakers: [],
    attendees: ['user_001']
  }
];

export const dummyNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'event_reminder',
    title: 'Event Tomorrow',
    message: 'Guest Lecture: AI in Business starts tomorrow at 6:00 PM. See you there!',
    timestamp: '2025-12-04T09:00:00Z',
    read: false,
    actionUrl: '/events/event_001',
    actionText: 'View Event',
    icon: '🔔'
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'event_registration',
    title: 'Registration Confirmed',
    message: 'You\'re registered for Case Competition Workshop on December 10th.',
    timestamp: '2025-11-20T14:20:00Z',
    read: false,
    actionUrl: '/events/event_002',
    actionText: 'View Event',
    icon: '✅'
  },
  {
    id: 'notif_003',
    userId: 'user_001',
    type: 'mentor_assigned',
    title: 'Mentor Assigned',
    message: 'Dr. Sarah Johnson from Deloitte Consulting is now your mentor. Reach out to schedule your first meeting!',
    timestamp: '2025-11-18T10:00:00Z',
    read: true,
    actionUrl: '/profile',
    actionText: 'View Mentor',
    icon: '🎓'
  },
  {
    id: 'notif_004',
    userId: 'user_001',
    type: 'event_reminder',
    title: 'Event in 1 Hour',
    message: 'Guest Lecture: AI in Business starts in 1 hour. Don\'t forget to attend!',
    timestamp: '2025-12-05T17:00:00Z',
    read: false,
    actionUrl: '/events/event_001',
    actionText: 'View Event',
    icon: '⏰'
  },
  {
    id: 'notif_005',
    userId: 'user_001',
    type: 'profile_reminder',
    title: 'Update Your Profile',
    message: 'Keep your profile up to date! Add more skills and interests to help us match you with opportunities.',
    timestamp: '2025-11-15T12:00:00Z',
    read: true,
    actionUrl: '/profile',
    actionText: 'Update Profile',
    icon: '👤'
  },
  {
    id: 'notif_006',
    userId: 'user_001',
    type: 'resume_reminder',
    title: 'Resume Updated',
    message: 'Your resume was successfully uploaded. Make sure it\'s current before the career fair!',
    timestamp: '2025-11-22T09:15:00Z',
    read: true,
    actionUrl: '/profile',
    actionText: 'View Resume',
    icon: '📄'
  },
  {
    id: 'notif_007',
    userId: 'user_001',
    type: 'event_registration',
    title: 'You\'re Registered!',
    message: 'Successfully registered for Guest Lecture: AI in Business on December 5th.',
    timestamp: '2025-11-25T16:45:00Z',
    read: true,
    actionUrl: '/events/event_001',
    actionText: 'View Event',
    icon: '✅'
  }
];
