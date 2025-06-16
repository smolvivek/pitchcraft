// FilmFreeway API Integration (Free Tier)
// Note: This is a simulation since FilmFreeway doesn't have a public API
// In production, you'd need to use web scraping or partner with FilmFreeway

export interface Festival {
  id: string;
  name: string;
  location: string;
  deadline: string;
  earlyDeadline?: string;
  fee: string;
  earlyFee?: string;
  prestige: 'A-List' | 'Major' | 'Regional' | 'Genre' | 'Student';
  genres: string[];
  description: string;
  website: string;
  submissionPlatform: string;
  acceptanceRate: string;
  averageEntries: string;
  benefits: string[];
  requirements: string[];
  matchScore?: number;
}

// Free festival database (updated regularly)
const FESTIVAL_DATABASE: Festival[] = [
  {
    id: 'sundance-2024',
    name: 'Sundance Film Festival',
    location: 'Park City, Utah',
    deadline: '2024-09-15',
    earlyDeadline: '2024-08-15',
    fee: '$75',
    earlyFee: '$65',
    prestige: 'A-List',
    genres: ['Drama', 'Documentary', 'Indie'],
    description: 'Premier independent film festival showcasing innovative storytelling',
    website: 'https://sundance.org',
    submissionPlatform: 'FilmFreeway',
    acceptanceRate: '2%',
    averageEntries: '15,000+',
    benefits: ['Industry networking', 'Distribution opportunities', 'Press coverage'],
    requirements: ['US premiere required', 'Max 120 minutes', 'English or subtitled']
  },
  {
    id: 'sxsw-2024',
    name: 'SXSW Film Festival',
    location: 'Austin, Texas',
    deadline: '2024-08-25',
    earlyDeadline: '2024-07-25',
    fee: '$50',
    earlyFee: '$40',
    prestige: 'Major',
    genres: ['Comedy', 'Horror', 'Sci-Fi', 'Music'],
    description: 'Innovative festival celebrating film, music, and interactive media',
    website: 'https://sxsw.com',
    submissionPlatform: 'FilmFreeway',
    acceptanceRate: '5%',
    averageEntries: '8,000+',
    benefits: ['Tech industry connections', 'Music crossover', 'Emerging talent focus'],
    requirements: ['US or Texas premiere preferred', 'Max 180 minutes', 'Recent production']
  },
  {
    id: 'tribeca-2024',
    name: 'Tribeca Film Festival',
    location: 'New York City',
    deadline: '2024-01-15',
    earlyDeadline: '2024-12-15',
    fee: '$65',
    earlyFee: '$55',
    prestige: 'Major',
    genres: ['Drama', 'Documentary', 'Short Film'],
    description: 'Prestigious NYC festival supporting independent filmmakers',
    website: 'https://tribecafilm.com',
    submissionPlatform: 'FilmFreeway',
    acceptanceRate: '4%',
    averageEntries: '6,000+',
    benefits: ['NYC industry access', 'Emerging filmmaker support', 'Distribution connections'],
    requirements: ['US premiere preferred', 'Completed after 2023', 'Professional production']
  },
  {
    id: 'fantastic-fest-2024',
    name: 'Fantastic Fest',
    location: 'Austin, Texas',
    deadline: '2024-06-01',
    earlyDeadline: '2024-05-01',
    fee: '$35',
    earlyFee: '$25',
    prestige: 'Genre',
    genres: ['Horror', 'Sci-Fi', 'Fantasy', 'Thriller'],
    description: 'Premier genre film festival for horror, sci-fi, and fantasy',
    website: 'https://fantasticfest.com',
    submissionPlatform: 'FilmFreeway',
    acceptanceRate: '8%',
    averageEntries: '3,000+',
    benefits: ['Genre film networking', 'Cult following', 'Industry genre connections'],
    requirements: ['Genre films only', 'US premiere preferred', 'Recent completion']
  }
];

export interface FestivalFilters {
  genre?: string;
  deadline?: 'soon' | 'later' | 'all';
  fee?: 'free' | 'low' | 'high' | 'all';
  prestige?: string;
  location?: string;
}

export const searchFestivals = async (filters: FestivalFilters = {}): Promise<Festival[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let results = [...FESTIVAL_DATABASE];
  
  // Apply filters
  if (filters.genre && filters.genre !== 'all') {
    results = results.filter(festival => 
      festival.genres.some(g => g.toLowerCase().includes(filters.genre!.toLowerCase()))
    );
  }
  
  if (filters.deadline && filters.deadline !== 'all') {
    const today = new Date();
    results = results.filter(festival => {
      const deadlineDate = new Date(festival.deadline);
      const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filters.deadline === 'soon') return daysUntil <= 30;
      if (filters.deadline === 'later') return daysUntil > 30;
      return true;
    });
  }
  
  if (filters.fee && filters.fee !== 'all') {
    results = results.filter(festival => {
      const feeAmount = parseInt(festival.fee.replace(/[^0-9]/g, '')) || 0;
      
      if (filters.fee === 'free') return feeAmount === 0;
      if (filters.fee === 'low') return feeAmount <= 50;
      if (filters.fee === 'high') return feeAmount > 50;
      return true;
    });
  }
  
  return results;
};

export const calculateMatchScore = (festival: Festival, project: { genre: string; tags: string[] }): number => {
  let score = 0;
  
  // Genre match (40% weight)
  if (festival.genres.some(g => g.toLowerCase() === project.genre.toLowerCase())) {
    score += 40;
  } else if (festival.genres.some(g => project.genre.toLowerCase().includes(g.toLowerCase()))) {
    score += 20;
  }
  
  // Tag matches (30% weight)
  const tagMatches = project.tags.filter(tag => 
    festival.genres.some(g => g.toLowerCase().includes(tag.toLowerCase())) ||
    festival.description.toLowerCase().includes(tag.toLowerCase())
  );
  score += Math.min(30, tagMatches.length * 10);
  
  // Prestige bonus (20% weight)
  if (festival.prestige === 'A-List') score += 20;
  else if (festival.prestige === 'Major') score += 15;
  else if (festival.prestige === 'Regional') score += 10;
  
  // Acceptance rate bonus (10% weight)
  const acceptanceRate = parseInt(festival.acceptanceRate.replace('%', ''));
  if (acceptanceRate > 10) score += 10;
  else if (acceptanceRate > 5) score += 5;
  
  return Math.min(100, score);
};

export const getFestivalRecommendations = async (project: { 
  genre: string; 
  tags: string[];
  budget?: 'low' | 'medium' | 'high';
}): Promise<Festival[]> => {
  const allFestivals = await searchFestivals();
  
  // Calculate match scores
  const festivalsWithScores = allFestivals.map(festival => ({
    ...festival,
    matchScore: calculateMatchScore(festival, project)
  }));
  
  // Sort by match score and return top recommendations
  return festivalsWithScores
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 10);
};