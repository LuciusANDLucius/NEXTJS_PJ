// services/OtherAPI/OpenWeatherService.js

const API_KEY = "ec2c1fc69738153b3201ea2b1e965515"; // Thay key của bạn vào

export const fetchWeatherData = async (lat, lon) => {
  try {
    // Sử dụng endpoint 'weather' (miễn phí) thay vì 'onecall'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi API");
    }

    const data = await response.json();
    
    // Cấu trúc dữ liệu của API 2.5 (Free) khác với One Call 3.0
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    }; 
  } catch (error) {
    console.error("Lỗi Weather Service:", error.message);
    return null;
  }
};