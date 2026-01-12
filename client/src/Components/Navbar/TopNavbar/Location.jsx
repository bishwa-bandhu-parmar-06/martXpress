import React, { useEffect, useState } from "react";
import LocationLoader from "../../Common/Loader/temp";
import { MapPin } from "lucide-react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          setLocation({
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown",
            pincode: data.address.postcode || "",
          });
        } catch {
          setError("Unable to fetch location");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="flex items-center gap-1 px-4 py-2 w-fit">
      {/* LEFT ICON / LOADER */}
      <div className="flex items-center justify-center w-8 h-8 text-primary">
        {loading ? <LocationLoader /> : <MapPin size={22} />}
      </div>

      {/* RIGHT TEXT */}
      <div className="flex flex-col leading-tight">
        {error && !loading ? (
          <span className="text-sm text-primary">{error}</span>
        ) : (
          location && (
            <>
              <span className="text-sm  dark:text-white font-medium text-gray-800">
                {location.city}
              </span>
              <span className="text-xs dark:text-white  text-gray-500">
                {location.pincode}
              </span>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Location;
