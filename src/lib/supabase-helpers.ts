import { supabase } from "@/integrations/supabase/client";

// Enhanced package fetching with relationships
export const fetchPackagesWithDestinations = async () => {
  const { data, error } = await supabase
    .from("packages")
    .select(`
      *,
      package_destinations (
        day_number,
        duration_hours,
        destinations (
          id,
          name,
          slug,
          description,
          category,
          latitude,
          longitude,
          image_url,
          popular_activities
        )
      ),
      package_reviews (
        id,
        rating,
        review_text,
        created_at,
        profiles (
          full_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Fetch destinations with filtering
export const fetchDestinations = async (filters?: {
  category?: string;
  search?: string;
}) => {
  let query = supabase
    .from("destinations")
    .select("*")
    .order('name');

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  return { data, error };
};

// Add package review
export const addPackageReview = async (reviewData: {
  package_id: string;
  rating: number;
  review_text?: string;
  travel_date?: string;
}) => {
  const { data, error } = await supabase
    .from("package_reviews")
    .insert([reviewData])
    .select();

  return { data, error };
};

// Create package booking
export const createPackageBooking = async (bookingData: {
  package_id: string;
  booking_date: string;
  number_of_people: number;
  total_amount?: number;
  special_requests?: string;
  contact_phone?: string;
  contact_email?: string;
}) => {
  const { data, error } = await supabase
    .from("package_bookings")
    .insert([bookingData])
    .select();

  return { data, error };
};

// Fetch user bookings
export const fetchUserBookings = async () => {
  const { data, error } = await supabase
    .from("package_bookings")
    .select(`
      *,
      packages (
        title,
        image_url,
        duration
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Search packages with advanced filters
export const searchPackages = async (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  difficulty?: string;
  season?: string;
  search?: string;
}) => {
  let query = supabase
    .from("packages")
    .select(`
      *,
      package_destinations (
        destinations (
          name,
          category,
          latitude,
          longitude
        )
      )
    `);

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    query = query.eq('difficulty_level', filters.difficulty);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });
  return { data, error };
};

// Get package statistics
export const getPackageStats = async () => {
  const { data: packages, error: packagesError } = await supabase
    .from("packages")
    .select("id, category, price, average_rating");

  const { data: bookings, error: bookingsError } = await supabase
    .from("package_bookings")
    .select("id, status, total_amount");

  const { data: reviews, error: reviewsError } = await supabase
    .from("package_reviews")
    .select("id, rating");

  if (packagesError || bookingsError || reviewsError) {
    return { data: null, error: packagesError || bookingsError || reviewsError };
  }

  const stats = {
    totalPackages: packages?.length || 0,
    totalBookings: bookings?.length || 0,
    totalReviews: reviews?.length || 0,
    averageRating: reviews?.length ? 
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
    categoryBreakdown: packages?.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {}) || {}
  };

  return { data: stats, error: null };
};