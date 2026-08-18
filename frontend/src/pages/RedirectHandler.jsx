import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RedirectHandler() {
  const { shortCode } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/urls/resolve/${shortCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        window.location.href = data.longUrl;
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, [shortCode]);

  return null;
}