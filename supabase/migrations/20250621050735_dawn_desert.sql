/*
  # Seed Destinations Data

  1. Insert popular Konkan destinations
  2. Link existing packages to destinations
  3. Add sample reviews for better demonstration

  This migration populates the database with real Konkan destinations
  and creates relationships with existing packages.
*/

-- Insert popular Konkan destinations
INSERT INTO destinations (name, slug, description, category, latitude, longitude, image_url, best_time_to_visit, estimated_cost_range, popular_activities, nearby_attractions) VALUES
('Tarkarli Beach', 'tarkarli-beach', 'Crystal clear waters perfect for water sports and relaxation. Known for its pristine white sand and excellent scuba diving opportunities.', 'beach', 16.0167, 73.4667, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'October to March', '₹2,000 - ₹5,000 per day', ARRAY['Scuba Diving', 'Water Sports', 'Beach Activities', 'Parasailing', 'Jet Skiing'], ARRAY['Tsunami Island', 'Devbagh Beach', 'Sindhudurg Fort']),

('Sindhudurg Fort', 'sindhudurg-fort', 'Historic sea fort built by Chhatrapati Shivaji Maharaj in 1664. A magnificent example of Maratha naval architecture.', 'heritage', 16.0333, 73.5000, 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'November to February', '₹500 - ₹1,500 per day', ARRAY['Fort Exploration', 'History Tour', 'Photography', 'Boat Ride'], ARRAY['Malvan Beach', 'Tarkarli Beach', 'Rock Garden']),

('Amboli Waterfalls', 'amboli-waterfalls', 'Breathtaking waterfalls surrounded by lush greenery in the Western Ghats. A paradise for nature lovers and trekkers.', 'waterfall', 15.9500, 74.0000, 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'June to September', '₹1,000 - ₹3,000 per day', ARRAY['Waterfall Viewing', 'Trekking', 'Nature Photography', 'Bird Watching'], ARRAY['Hiranyakeshi Temple', 'Sunset Point', 'Kawalesad Rapids']),

('Malvan Beach', 'malvan-beach', 'Famous for authentic Malvani cuisine and excellent scuba diving opportunities. A perfect blend of culture and adventure.', 'beach', 16.0594, 73.4707, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'October to March', '₹2,500 - ₹6,000 per day', ARRAY['Scuba Diving', 'Malvani Cuisine', 'Seafood', 'Cultural Tours'], ARRAY['Sindhudurg Fort', 'Rock Garden', 'Chivla Beach']),

('Vengurla Beach', 'vengurla-beach', 'Pristine beach with golden sand and coconut groves. Perfect for peaceful getaways and sunset photography.', 'beach', 15.8667, 73.6333, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'November to March', '₹1,500 - ₹4,000 per day', ARRAY['Sunset Photography', 'Beach Walks', 'Coconut Groves', 'Peaceful Relaxation'], ARRAY['Sagareshwar Beach', 'Mochemad Beach', 'Vengurla Lighthouse']),

('Devbagh Beach', 'devbagh-beach', 'Secluded beach perfect for peaceful getaways. Known for turtle nesting and pristine natural beauty.', 'beach', 16.0000, 73.4500, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'October to April', '₹1,000 - ₹3,500 per day', ARRAY['Turtle Watching', 'Beach Camping', 'Fishing', 'Nature Walks'], ARRAY['Tarkarli Beach', 'Karli River', 'Devbagh Sangam']),

('Sawantwadi Palace', 'sawantwadi-palace', 'Historic palace showcasing royal architecture and traditional Goan-Marathi culture. Famous for wooden toys and crafts.', 'heritage', 15.9000, 73.8167, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'October to March', '₹800 - ₹2,000 per day', ARRAY['Palace Tour', 'Craft Shopping', 'Cultural Experience', 'Photography'], ARRAY['Moti Talao', 'Sawantwadi Market', 'Amboli Ghat']),

('Kunkeshwar Temple', 'kunkeshwar-temple', 'Ancient Shiva temple located on the seashore. A perfect blend of spirituality and natural beauty.', 'temple', 16.0833, 73.4833, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Year Round', '₹500 - ₹1,500 per day', ARRAY['Temple Visit', 'Spiritual Experience', 'Beach Views', 'Photography'], ARRAY['Devbagh Beach', 'Tarkarli Beach', 'Tsunami Island']),

('Redi Beach', 'redi-beach', 'Untouched beach with red laterite cliffs and pristine waters. Perfect for those seeking solitude and natural beauty.', 'beach', 15.7500, 73.5833, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'November to March', '₹1,200 - ₹3,000 per day', ARRAY['Beach Photography', 'Cliff Views', 'Peaceful Walks', 'Sunset Views'], ARRAY['Vengurla Beach', 'Terekhol Fort', 'Arambol Beach']),

('Vijaydurg Fort', 'vijaydurg-fort', 'Coastal fort known as the "Gibraltar of the East". Rich in Maratha naval history and stunning sea views.', 'heritage', 16.5500, 73.3333, 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'October to March', '₹600 - ₹1,800 per day', ARRAY['Fort Exploration', 'History Tour', 'Sea Views', 'Photography'], ARRAY['Vijaydurg Beach', 'Devgad Beach', 'Kunkeshwar Temple'])

ON CONFLICT (slug) DO NOTHING;

-- Update existing packages with enhanced data
UPDATE packages SET 
  category = 'beach',
  difficulty_level = 'easy',
  min_group_size = 2,
  max_group_size = 15,
  available_seasons = ARRAY['winter', 'summer'],
  inclusions = ARRAY['Transportation', 'Guide', 'Entry Fees', 'Basic Equipment'],
  exclusions = ARRAY['Personal Expenses', 'Meals', 'Accommodation'],
  tags = ARRAY['beach', 'water sports', 'adventure', 'family-friendly']
WHERE id = '1' AND title ILIKE '%tarkarli%';

UPDATE packages SET 
  category = 'heritage',
  difficulty_level = 'easy',
  min_group_size = 1,
  max_group_size = 25,
  available_seasons = ARRAY['winter', 'summer'],
  inclusions = ARRAY['Boat Transfer', 'Guide', 'Entry Fees'],
  exclusions = ARRAY['Personal Expenses', 'Meals', 'Photography Charges'],
  tags = ARRAY['heritage', 'history', 'fort', 'cultural', 'photography']
WHERE id = '2' AND title ILIKE '%fort%';

UPDATE packages SET 
  category = 'nature',
  difficulty_level = 'moderate',
  min_group_size = 2,
  max_group_size = 12,
  available_seasons = ARRAY['monsoon'],
  inclusions = ARRAY['Transportation', 'Guide', 'Trekking Equipment'],
  exclusions = ARRAY['Personal Expenses', 'Meals', 'Accommodation'],
  tags = ARRAY['nature', 'waterfall', 'trekking', 'monsoon', 'photography']
WHERE id = '3' AND title ILIKE '%amboli%';

-- Link packages to destinations
INSERT INTO package_destinations (package_id, destination_id, day_number, duration_hours)
SELECT 
  '1' as package_id,
  d.id as destination_id,
  1 as day_number,
  8 as duration_hours
FROM destinations d 
WHERE d.slug = 'tarkarli-beach'
ON CONFLICT (package_id, destination_id) DO NOTHING;

INSERT INTO package_destinations (package_id, destination_id, day_number, duration_hours)
SELECT 
  '2' as package_id,
  d.id as destination_id,
  1 as day_number,
  4 as duration_hours
FROM destinations d 
WHERE d.slug = 'sindhudurg-fort'
ON CONFLICT (package_id, destination_id) DO NOTHING;

INSERT INTO package_destinations (package_id, destination_id, day_number, duration_hours)
SELECT 
  '3' as package_id,
  d.id as destination_id,
  1 as day_number,
  6 as duration_hours
FROM destinations d 
WHERE d.slug = 'amboli-waterfalls'
ON CONFLICT (package_id, destination_id) DO NOTHING;