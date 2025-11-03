"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// ✅ types for data
interface WeatherCondition {
  text: string;
  icon?: string;
}

interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
}

interface LocationData {
  name: string;
  country: string;
}

export default function Home() {
  const [query, setQuery] = useState("netrakona");
  const [search, setSearch] = useState("netrakona");
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  // ✅ debounce
  useEffect(() => {
    const delay = setTimeout(() => setSearch(query), 800);
    return () => clearTimeout(delay);
  }, [query]);

  // ✅ fetch weather data
  useEffect(() => {
    if (!search) return;

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_API_KEY");
      return;
    }

    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${search}&aqi=yes`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current && data?.location) {
          setCurrent(data.current);
          setLocation(data.location);
        } else {
          console.warn("Invalid data:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [search]);

  const condition = current?.condition?.text?.toLowerCase() || "";
  const isDay = current?.is_day === 1;

  // ✅ map condition to image
  const getWeatherIcon = () => {
    if (condition.includes("cloudy")) return "/images/Icon=Cloudy.svg";
    if (condition.includes("partly")) return "/images/Icon=Partly Cloudy.svg";
    if (condition.includes("sunny") && isDay) return "/images/Icon=Sunny.svg";
    if (condition.includes("clear") && isDay) return "/images/Icon=Sunny.svg";
    if (!isDay) return "/images/Icon=Night.svg";
    if (condition.includes("snow")) return "/images/Icon=Snow.svg";
    return "/images/Icon=Partly Cloudy.svg";
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[url(/images/lake.png)] bg-cover bg-no-repeat">
      <Card className="w-fit min-w-md m-auto border-none bg-transparent rounded-3xl backdrop-brightness-110 neumorphism backdrop-blur">
        <CardContent>
          <InputGroup className="border-none neumorphism">
            <InputGroupAddon>
              <MapPin />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Enter location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>

          <div className="flex items-end justify-center gap-10 py-5">
            <Image
              src={getWeatherIcon()}
              alt={condition || "Weather"}
              width={1000}
              height={1000}
              className="w-60 h-60 drop-shadow-2xl"
            />

            <div className="space-y-2">
              <Image
                width={50}
                height={50}
                src={
                  isDay ? "/images/Icon=Sunny.svg" : "/images/Icon=Night.svg"
                }
                alt="day-night"
                className="drop-shadow-2xl"
              />
              <div>
                <span className="text-xl space-x-5">
                  {current?.temp_c ?? 0}
                  <small>°C</small> / {current?.temp_f ?? 0}
                  <small>°F</small>
                </span>
                <p>
                  {location?.name || "City"} / {location?.country || "Country"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
