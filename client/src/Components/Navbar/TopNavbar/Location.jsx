import React, { useEffect, useState } from "react";
import LocationLoader from "../../Common/Loader/temp"; // Adjust path if needed
import { MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { getAllUserAddresses } from "../../../API/users/usersApi"; // Adjust path to your usersApi.js

const Location = () => {
  // 1. Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Browser GPS Fallback Logic
  const fetchGPSLocation = () => {
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
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
      },
    );
  };

  // 3. Smart Location Loader logic
  useEffect(() => {
    const determineLocation = async () => {
      setLoading(true);
      setError("");

      // If user is logged in, try fetching their saved addresses first
      if (isAuthenticated && user?.role === "user") {
        try {
          const res = await getAllUserAddresses();
          const addresses = res.addresses || [];

          // If they are logged in AND have a saved address
          if (addresses.length > 0) {
            const primaryAddress = addresses[0]; // You can also filter by isDefault if you have that

            setLocation({
              city: primaryAddress.city,
              pincode: primaryAddress.pincode,
            });

            setLoading(false);
            return; // We have the DB address, so we exit the function here! No GPS needed.
          }
        } catch (err) {
          console.error(
            "Failed to fetch user addresses for location indicator:",
            err,
          );
          // If the API fails, we don't crash, we just let it fall through to GPS
        }
      }

      // If we reach this point, it means:
      // A) User is NOT logged in, OR
      // B) User is logged in but has NO addresses, OR
      // C) The address API failed.
      // So, we use the browser GPS fallback.
      fetchGPSLocation();
    };

    determineLocation();
  }, [isAuthenticated, user?.role]); // Re-runs when the user logs in or out

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
              <span className="text-sm dark:text-white font-medium text-gray-800">
                {location.city}
              </span>
              <span className="text-xs dark:text-white text-gray-500">
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
