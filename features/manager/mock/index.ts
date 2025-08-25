
// Dummy venue data based on the provided schema
const dummyVenues = [
    {
      id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      name: 'The Sports Hub',
      address: '123 Main Street, Downtown',
      description: 'Premier sports viewing venue with 15+ screens and premium audio',
      amenities: ['Large Screens', 'Private Booths', 'Full Bar', 'Kitchen'],
      average_rating: 4.8,
      pricing: 25,
      capacity: 120,
      contact_phone: '(555) 123-4567',
      contact_email: 'info@sportshub.com',
      website_url: 'www.thesportshub.com',
      status: 'published',
      is_approved: true,
      is_active: true,
      image: '/api/placeholder/600/400'
    },
    {
      id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
      name: 'Champions Bar & Grill',
      address: '456 Stadium Ave, Uptown',
      description: 'Sports bar with great atmosphere and game day specials',
      amenities: ['Multiple TVs', 'Outdoor Seating', 'Game Day Menu', 'Beer Selection'],
      average_rating: 4.5,
      pricing: 20,
      capacity: 80,
      contact_phone: '(555) 987-6543',
      contact_email: 'hello@championsbar.com',
      website_url: 'www.championsbar.com',
      status: 'published',
      is_approved: true,
      is_active: true,
      image: '/api/placeholder/600/400'
    },
    {
      id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
      name: 'The Goal Post',
      address: '789 College Blvd, Westside',
      description: 'Student-friendly sports bar with daily specials',
      amenities: ['Student Discounts', 'Pool Tables', 'Arcade Games', 'Wings'],
      average_rating: 4.2,
      pricing: 15,
      capacity: 150,
      contact_phone: '(555) 456-7890',
      contact_email: 'contact@goalpost.com',
      website_url: 'www.thegoalpost.com',
      status: 'draft',
      is_approved: false,
      is_active: false,
      image: '/api/placeholder/600/400'
    }
  ];
  
  // Dummy upcoming games data (simulating TheSportsDB API)
  const dummyUpcomingGames = [
    {
      id: 'g1',
      sport: 'Soccer',
      league: 'Premier League',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      date: '2025-05-12T15:00:00',
      venue: 'Emirates Stadium',
      thumbnail: '/api/placeholder/400/250',
      isScreening: true,
      venueId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
    },
    {
      id: 'g2',
      sport: 'Basketball',
      league: 'NBA',
      homeTeam: 'LA Lakers',
      awayTeam: 'Golden State Warriors',
      date: '2025-05-13T19:30:00',
      venue: 'Crypto.com Arena',
      thumbnail: '/api/placeholder/400/250',
      isScreening: true,
      venueId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
    },
    {
      id: 'g3',
      sport: 'American Football',
      league: 'NFL',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      date: '2025-05-15T20:00:00',
      venue: 'Arrowhead Stadium',
      thumbnail: '/api/placeholder/400/250',
      isScreening: false
    },
    {
      id: 'g4',
      sport: 'Baseball',
      league: 'MLB',
      homeTeam: 'New York Yankees',
      awayTeam: 'Boston Red Sox',
      date: '2025-05-11T18:00:00',
      venue: 'Yankee Stadium',
      thumbnail: '/api/placeholder/400/250',
      isScreening: true,
      venueId: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'
    },
    {
      id: 'g5',
      sport: 'Hockey',
      league: 'NHL',
      homeTeam: 'New York Rangers',
      awayTeam: 'Toronto Maple Leafs',
      date: '2025-05-14T19:00:00',
      venue: 'Madison Square Garden',
      thumbnail: '/api/placeholder/400/250',
      isScreening: false
    },
    {
      id: 'g6',
      sport: 'Cricket',
      league: 'IPL',
      homeTeam: 'Mumbai Indians',
      awayTeam: 'Chennai Super Kings',
      date: '2025-05-16T15:30:00',
      venue: 'Wankhede Stadium',
      thumbnail: '/api/placeholder/400/250',
      isScreening: false
    }
  ];
  
  // Dummy bookings data
  const dummyBookings = [
    {
      id: 'b1',
      gameId: 'g1',
      venueName: 'The Sports Hub',
      customerName: 'John Smith',
      date: '2025-05-12',
      time: '15:00',
      partySize: 4,
      status: 'confirmed'
    },
    {
      id: 'b2',
      gameId: 'g2',
      venueName: 'The Sports Hub',
      customerName: 'Sarah Johnson',
      date: '2025-05-13',
      time: '19:30',
      partySize: 2,
      status: 'confirmed'
    },
    {
      id: 'b3',
      gameId: 'g1',
      venueName: 'The Sports Hub',
      customerName: 'Mike Williams',
      date: '2025-05-12',
      time: '15:00',
      partySize: 6,
      status: 'pending'
    }
  ];
  
  // Dummy analytics data
  const dummyAnalytics = {
    totalBookings: 26,
    bookingsThisWeek: 12,
    upcomingScreenings: 5,
    averageRating: 4.7,
    popularGames: [
      { name: 'Soccer - Premier League', percent: 45 },
      { name: 'Basketball - NBA', percent: 30 },
      { name: 'Baseball - MLB', percent: 15 },
      { name: 'Other', percent: 10 }
    ]
  };


  export {
    dummyVenues,
    dummyUpcomingGames,
    dummyBookings,
    dummyAnalytics
  };