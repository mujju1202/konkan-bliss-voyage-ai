/*
  # Enhanced Packages Schema

  1. New Tables
    - `destinations` - Master list of all Konkan destinations
    - `package_destinations` - Many-to-many relationship between packages and destinations
    - `package_reviews` - User reviews and ratings for packages
    - `package_bookings` - Track package bookings and status

  2. Enhanced Existing Tables
    - Add more fields to packages for better categorization
    - Add search and filtering capabilities
    - Improve data normalization

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- Create destinations master table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('beach', 'heritage', 'nature', 'temple', 'waterfall', 'cultural')),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  image_url text,
  best_time_to_visit text,
  estimated_cost_range text,
  popular_activities text[],
  nearby_attractions text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create package-destination relationship table
CREATE TABLE IF NOT EXISTS package_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id text REFERENCES packages(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  day_number integer,
  duration_hours integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(package_id, destination_id)
);

-- Create package reviews table
CREATE TABLE IF NOT EXISTS package_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id text REFERENCES packages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  photos text[],
  travel_date date,
  verified_booking boolean DEFAULT false,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create package bookings table
CREATE TABLE IF NOT EXISTS package_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id text REFERENCES packages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  number_of_people integer NOT NULL DEFAULT 1,
  total_amount decimal(10, 2),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  contact_phone text,
  contact_email text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to existing packages table
DO $$
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'category'
  ) THEN
    ALTER TABLE packages ADD COLUMN category text DEFAULT 'beach' 
    CHECK (category IN ('beach', 'heritage', 'nature', 'temple', 'waterfall', 'cultural', 'adventure', 'family'));
  END IF;

  -- Add difficulty level
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE packages ADD COLUMN difficulty_level text DEFAULT 'easy' 
    CHECK (difficulty_level IN ('easy', 'moderate', 'challenging'));
  END IF;

  -- Add group size limits
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'min_group_size'
  ) THEN
    ALTER TABLE packages ADD COLUMN min_group_size integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'max_group_size'
  ) THEN
    ALTER TABLE packages ADD COLUMN max_group_size integer DEFAULT 20;
  END IF;

  -- Add rating and review count
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE packages ADD COLUMN average_rating decimal(3, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE packages ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  -- Add seasonal availability
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'available_seasons'
  ) THEN
    ALTER TABLE packages ADD COLUMN available_seasons text[] DEFAULT ARRAY['year_round'];
  END IF;

  -- Add inclusions and exclusions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'inclusions'
  ) THEN
    ALTER TABLE packages ADD COLUMN inclusions text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'exclusions'
  ) THEN
    ALTER TABLE packages ADD COLUMN exclusions text[];
  END IF;

  -- Add tags for better search
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'tags'
  ) THEN
    ALTER TABLE packages ADD COLUMN tags text[];
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for destinations (public read)
CREATE POLICY "Destinations are viewable by everyone"
  ON destinations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert destinations"
  ON destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for package_destinations (public read)
CREATE POLICY "Package destinations are viewable by everyone"
  ON package_destinations
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for package_reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON package_reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON package_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON package_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON package_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for package_bookings
CREATE POLICY "Users can view their own bookings"
  ON package_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
  ON package_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON package_bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_coordinates ON destinations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_package_destinations_package_id ON package_destinations(package_id);
CREATE INDEX IF NOT EXISTS idx_package_reviews_package_id ON package_reviews(package_id);
CREATE INDEX IF NOT EXISTS idx_package_reviews_rating ON package_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_package_bookings_user_id ON package_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_package_bookings_status ON package_bookings(status);
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_rating ON packages(average_rating);

-- Create function to update package ratings
CREATE OR REPLACE FUNCTION update_package_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE packages 
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM package_reviews 
      WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM package_reviews 
      WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
    )
  WHERE id = COALESCE(NEW.package_id, OLD.package_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update package ratings
DROP TRIGGER IF EXISTS trigger_update_package_rating_insert ON package_reviews;
CREATE TRIGGER trigger_update_package_rating_insert
  AFTER INSERT ON package_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_package_rating();

DROP TRIGGER IF EXISTS trigger_update_package_rating_update ON package_reviews;
CREATE TRIGGER trigger_update_package_rating_update
  AFTER UPDATE ON package_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_package_rating();

DROP TRIGGER IF EXISTS trigger_update_package_rating_delete ON package_reviews;
CREATE TRIGGER trigger_update_package_rating_delete
  AFTER DELETE ON package_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_package_rating();