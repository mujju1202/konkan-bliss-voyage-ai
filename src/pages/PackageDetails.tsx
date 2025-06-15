
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

type Package = {
  id: string;
  title: string;
  image_url?: string | null;
  description: string;
  highlights?: string[];
  price?: number;
  duration?: string;
  places_included?: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
    restaurants?: { name: string; contact?: string; rating?: number }[];
  }[];
  activities?: string[];
};

const fetchPackageDetails = async (id: string) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;

  // Optionally, fetch associated restaurant/location info from another table if needed.
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

  // Calculate map center
  let mapCenter: [number, number] = [16.0167, 73.4667];
  if (pkg.places_included && pkg.places_included.length > 0) {
    mapCenter = [
      pkg.places_included[0].latitude ?? 16.0167,
      pkg.places_included[0].longitude ?? 73.4667,
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
                  {pkg.places_included.map((loc, idx) => (
                    <li key={idx} className="border p-3 rounded-lg bg-konkan-turquoise-50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{loc.name}</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="ml-2"
                          onClick={() => handleNavigate(loc.latitude, loc.longitude)}
                        >
                          Navigate
                        </Button>
                      </div>
                      <div className="text-sm text-gray-700">{loc.description}</div>
                      {loc.restaurants && loc.restaurants.length > 0 && (
                        <div className="mt-2">
                          <span className="font-semibold">Nearby Restaurants:</span>
                          <ul className="list-disc list-inside text-xs mt-1">
                            {loc.restaurants.map((r, i) => (
                              <li key={i}>
                                <b>{r.name}</b>
                                {r.contact && <> | {r.contact}</>}
                                {r.rating && <> | {r.rating} ★</>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        {pkg.places_included && pkg.places_included.length > 0 && (
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
              {pkg.places_included.map((loc, idx) => (
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
