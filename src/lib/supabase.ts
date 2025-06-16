import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehsjnyrygrdcptoblftc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoc2pueXJ5Z3JkY3B0b2JsZnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTE1NDYsImV4cCI6MjA2NTMyNzU0Nn0.A-gPg3O49LhyzP_QpAwM7jmMdVugPqaQuJwANZYEV70';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Database types
export interface Profile {
  id: string;
  name: string;
  email: string;
  job_title?: string;
  company?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  genre: string;
  logline?: string;
  synopsis?: string;
  concept?: string;
  status: 'draft' | 'developing' | 'pitch-ready' | 'submitted';
  progress: number;
  tags: string[];
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  permissions: string[];
  created_at: string;
}

export interface Outreach {
  id: string;
  project_id: string;
  user_id: string;
  recipient_name: string;
  recipient_email: string;
  company?: string;
  status: 'sent' | 'opened' | 'responded' | 'rejected';
  sent_at: string;
  responded_at?: string;
  created_at: string;
}

// FREE AI Generation simulation (no external APIs)
export const generatePitchMaterials = async (projectData: {
  title: string;
  genre: string;
  concept?: string;
  tone?: string;
  targetAudience?: string;
}) => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate content based on genre and inputs
  const genreTemplates = {
    'thriller': {
      loglineTemplate: 'A {tone} thriller that follows {protagonist} as they uncover {conflict} while racing against time to {stakes}.',
      synopsisTemplate: 'This gripping {genre} explores themes of {themes} through the lens of {setting}. {concept} The narrative builds tension through {techniques} that create a memorable and marketable story perfect for {audience} audiences.',
      themes: ['paranoia', 'conspiracy', 'justice', 'survival'],
      techniques: ['psychological tension', 'plot twists', 'character development'],
      protagonist: 'a determined investigator'
    },
    'drama': {
      loglineTemplate: 'A {tone} drama about {protagonist} who must {conflict} while dealing with {personalStakes}.',
      synopsisTemplate: 'This emotionally resonant {genre} delves into {themes} with authentic character development. {concept} The narrative unfolds through {techniques} that create meaningful connections with {audience} viewers.',
      themes: ['family', 'identity', 'redemption', 'loss'],
      techniques: ['intimate character moments', 'realistic dialogue', 'emotional depth'],
      protagonist: 'a complex character'
    },
    'sci-fi': {
      loglineTemplate: 'In a {tone} future, {protagonist} discovers {conflict} that threatens {stakes}.',
      synopsisTemplate: 'This innovative {genre} combines cutting-edge concepts with human storytelling. {concept} The narrative explores {themes} through {techniques} that appeal to both genre fans and {audience} audiences.',
      themes: ['technology vs humanity', 'evolution', 'consciousness', 'reality'],
      techniques: ['world-building', 'scientific concepts', 'philosophical questions'],
      protagonist: 'a visionary scientist'
    }
  };

  const template = genreTemplates[projectData.genre.toLowerCase() as keyof typeof genreTemplates] || genreTemplates['drama'];
  
  return {
    logline: `A ${projectData.tone?.toLowerCase() || 'compelling'} ${projectData.genre.toLowerCase()} that follows the journey of ${projectData.title} - exploring themes of identity, purpose, and human connection in a way that resonates with ${projectData.targetAudience || 'mainstream'} audiences.`,
    synopsis: `This ${projectData.genre} project explores universal themes through a unique lens. ${projectData.concept || 'The story unfolds with compelling characters and unexpected developments.'} The narrative combines ${projectData.tone?.toLowerCase() || 'engaging'} elements with authentic emotional depth, creating a memorable and marketable story perfect for today's entertainment landscape. With strong character arcs and a clear three-act structure, this project offers both commercial appeal and artistic integrity.`,
    characterProfiles: [
      {
        name: 'Protagonist',
        description: 'A complex character driven by compelling motivations and clear goals.',
        arc: 'Transforms from initial state to empowered resolution through meaningful challenges.'
      },
      {
        name: 'Antagonist',
        description: 'A formidable opponent with understandable motivations.',
        arc: 'Provides meaningful conflict that tests the protagonist\'s resolve.'
      }
    ],
    episodeGuide: projectData.genre.toLowerCase().includes('series') ? [
      { episode: 1, title: 'Pilot', description: 'Introduces the world and main characters, establishes central conflict' },
      { episode: 2, title: 'Rising Action', description: 'Develops central conflict and character relationships' },
      { episode: 3, title: 'Midpoint', description: 'Major revelation changes everything, raises stakes' },
      { episode: 4, title: 'Complications', description: 'Characters face their greatest challenges' },
      { episode: 5, title: 'Climax', description: 'Final confrontation and resolution' }
    ] : null,
    moodboard: {
      visualStyle: `${projectData.tone || 'Cinematic'} and atmospheric`,
      colorPalette: ['#2C3E50', '#E74C3C', '#F39C12'],
      references: ['Contemporary cinema', 'Genre classics', 'Visual storytelling']
    }
  };
};

// PayPal integration helper (using your credentials)
export const initializePayPal = () => {
  return {
    clientId: 'Afib5o07JPVuPRZOCiZbhL23pwA05zHeA6frNYKTwRemJiOrSap_CT-LevURF5LkKkKdpQrA-F6e1m6E',
    // Note: Secret key should be stored securely on server-side only
    currency: 'USD',
    environment: 'sandbox' // Change to 'production' for live payments
  };
};

// FilmFreeway API simulation (free tier)
export const searchFestivals = async (filters: {
  genre?: string;
  deadline?: string;
  fee?: string;
}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock festival data (in real app, this would come from FilmFreeway API)
  return [
    {
      id: 'sundance-2024',
      name: 'Sundance Film Festival',
      deadline: '2024-09-15',
      fee: '$75',
      genres: ['Drama', 'Documentary', 'Indie'],
      prestige: 'A-List',
      acceptanceRate: '2%'
    }
    // More festivals...
  ];
};