
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default marker fix for leaflet via CDN assets (works on Vite setups)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Demo/static place details (extend as you wish)
const staticPlaces: Record<string, { name: string; latitude: number; longitude: number; description?: string }> = {
  "Tarkarli Beach": {
    name: "Tarkarli Beach",
    latitude: 16.0167,
    longitude: 73.4667,
    description: "Crystal clear waters perfect for water sports and relaxation",
  },
  "Sindhudurg Fort": {
    name: "Sindhudurg Fort",
    latitude: 16.0333,
    longitude: 73.5000,
    description: "Historic sea fort built by Chhatrapati Shivaji Maharaj",
  },
  "Amboli Waterfalls": {
    name: "Amboli Waterfalls",
    latitude: 15.9500,
    longitude: 74.0000,
    description: "Breathtaking waterfalls surrounded by lush greenery",
  },
  "Malvan Beach": {
    name: "Malvan Beach",
    latitude: 16.0594,
    longitude: 73.4707,
    description: "Famous for scuba diving and authentic Malvani cuisine",
  },
  "Vengurla Beach": {
    name: "Vengurla Beach",
    latitude: 15.8667,
    longitude: 73.6333,
    description: "Pristine beach with golden sand and coconut groves",
  }
};

type Package = {
  id: string;
  title: string;
  image_url?: string | null;
  description: string;
  highlights?: string[];
  price?: number;
  duration?: string;
  places_included?: string[];
  activities?: string[];
};

const fetchPackageDetails = async (id: string): Promise<Package | null> => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
};

const handleNavigate = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  window.open(url, "_blank");
};

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPackageDetails(id).then((data) => {
      setPkg(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg text-gray-700">Loading package details...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-gray-600 font-semibold">Package not found.</p>
        <Link to="/explore"><Button className="mt-6">Back to Explore</Button></Link>
      </div>
    );
  }

  // Calculate map center from first static place if present
  let mapCenter: [number, number] = [16.0167, 73.4667];
  const locationObjects =
    pkg.places_included
      ?.map((name) => staticPlaces[name])
      .filter((x) => !!x) as { name: string; latitude: number; longitude: number; description?: string }[];

  if (locationObjects && locationObjects.length > 0) {
    mapCenter = [
      locationObjects[0].latitude,
      locationObjects[0].longitude
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-konkan-turquoise-50 via-white to-konkan-orange-50 pb-16">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
        <Link to="/explore">
          <Button variant="outline" className="mb-4">
            &larr; Back to Explore
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
        {pkg.image_url && (
          <img
            src={pkg.image_url}
            alt={pkg.title}
            className="w-full h-64 object-cover rounded-md mb-6"
          />
        )}
        <p className="mb-4 text-lg text-gray-700">{pkg.description}</p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-4">
              <span className="font-semibold">Duration:</span>{" "}
              {pkg.duration || "N/A"}
            </div>
            {pkg.price && (
              <div className="mb-4">
                <span className="font-semibold">Estimated Cost:</span>{" "}
                ₹{pkg.price}
              </div>
            )}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Highlights:</span>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {pkg.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.activities && pkg.activities.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Activities:</span>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {pkg.activities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            {pkg.places_included && pkg.places_included.length > 0 && (
              <>
                <h3 className="font-semibold text-lg mb-3">Locations Covered</h3>
                <ul className="space-y-3">
                  {pkg.places_included.map((placeName, idx) => {
                    const staticPlace = staticPlaces[placeName];
                    return (
                      <li key={idx} className="border p-3 rounded-lg bg-konkan-turquoise-50">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{placeName}</span>
                          {staticPlace && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="ml-2"
                              onClick={() => handleNavigate(staticPlace.latitude, staticPlace.longitude)}
                            >
                              Navigate
                            </Button>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">{staticPlace?.description}</div>
                        {/* No restaurant info for static places in this demo */}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
        {locationObjects && locationObjects.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Map of All Locations</h3>
            <MapContainer
              center={mapCenter}
              zoom={10}
              style={{ height: "350px", width: "100%", borderRadius: "12px" }}
              scrollWheelZoom={false}
              className="mb-5"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {locationObjects.map((loc, idx) => (
                <Marker
                  key={idx}
                  position={[loc.latitude, loc.longitude]}
                  title={loc.name}
                >
                  <Popup>
                    <div>
                      <b>{loc.name}</b>
                      <br />
                      {loc.description}
                      <br />
                      <Button
                        size="sm"
                        onClick={() => handleNavigate(loc.latitude, loc.longitude)}
                      >
                        Navigate
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
