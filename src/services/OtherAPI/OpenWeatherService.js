export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

    if (!response.ok) {
      throw new Error("Lỗi API Weather nội bộ");
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi Weather Service:", error.message);
    return null;
  }
};