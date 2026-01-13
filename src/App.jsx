import { useRef, useState, useEffect } from "react";

// API key for OpenWeatherMap
// Note: In production, move this to environment variables
const API_KEY = "5c86490ff1685b81ccc2dcc182a48a32";

// HTTP status codes for error handling
const ERROR_CODES = {
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
};

// Weather type configurations with corresponding icons
const WEATHER_TYPES = [
	{
		type: "Clear",
		img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
	},
	{
		type: "Rain",
		img: "https://cdn-icons-png.flaticon.com/128/463/463963.png",
	},
	{
		type: "Snow",
		img: "https://cdn-icons-png.flaticon.com/128/2315/2315309.png",
	},
	{
		type: "Clouds",
		img: "https://cdn-icons-png.flaticon.com/128/1163/1163624.png",
	},
	{
		type: "Haze",
		img: "https://cdn-icons-png.flaticon.com/128/4151/4151022.png",
	},
	{
		type: "Smoke",
		img: "https://cdn-icons-png.flaticon.com/128/9583/9583439.png",
	},
	{
		type: "Mist",
		img: "https://cdn-icons-png.flaticon.com/128/4005/4005901.png",
	},
	{
		type: "Drizzle",
		img: "https://cdn-icons-png.flaticon.com/128/2412/2412669.png",
	},
];

// Not found weather configuration
const NOT_FOUND_WEATHER = {
	type: "Not Found",
	img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
};

const App = () => {
	const inputRef = useRef(null);
	const [apiData, setApiData] = useState(null);
	const [showWeather, setShowWeather] = useState(null);
	const [loading, setLoading] = useState(false);
	const [darkMode, setDarkMode] = useState(() => {
		// Check localStorage or default to false
		return localStorage.getItem("darkMode") === "true";
	});

	// Apply dark mode class to document
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("darkMode", darkMode.toString());
	}, [darkMode]);

	/**
	 * Toggles dark mode
	 */
	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	/**
	 * Determines temperature description based on temperature value
	 * @param {number} temperature - Temperature in Celsius
	 * @returns {string} Temperature description
	 */
	const getTemperatureDescription = (temperature) => {
		if (temperature <= 0) return "Below Zero";
		if (temperature >= 1 && temperature < 20) return "Cold";
		if (temperature > 21 && temperature <= 30) return "Warm";
		if (temperature >= 30 && temperature <= 35) return "Hot";
		return "Very Hot";
	};

	/**
	 * Fetches weather data from OpenWeatherMap API
	 */
	const fetchWeather = async () => {
		const cityName = inputRef.current?.value.trim();
		if (!cityName) return;

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

		setLoading(true);
		setApiData(null);

		try {
			const response = await fetch(url);
			const data = await response.json();

			// Handle API error responses
			if (
				data.cod === ERROR_CODES.NOT_FOUND ||
				data.cod === ERROR_CODES.BAD_REQUEST
			) {
				setShowWeather([NOT_FOUND_WEATHER]);
				setLoading(false);
				return;
			}

			// Match weather type with icon
			const matchedWeather = WEATHER_TYPES.find(
				(weather) => weather.type === data.weather[0]?.main
			);

			setShowWeather(matchedWeather ? [matchedWeather] : [NOT_FOUND_WEATHER]);
			setApiData(data);
		} catch (error) {
			// Handle network errors
			setShowWeather([NOT_FOUND_WEATHER]);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles Enter key press in the input field
	 */
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			fetchWeather();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
			{/* Dark mode toggle button */}
			<button
				onClick={toggleDarkMode}
				className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
				aria-label="Toggle dark mode"
			>
				{darkMode ? (
					<svg
						className="w-6 h-6 text-yellow-500"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						className="w-6 h-6 text-gray-700"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
					</svg>
				)}
			</button>

			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="w-full max-w-md">
					{/* Main card with modern design */}
					<div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/50 transition-all duration-300">
						{/* Header */}
						<div className="text-center mb-6">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
								Weather App
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
								Search for weather information
							</p>
						</div>

						{/* Search input and button */}
						<div className="flex items-center gap-3 mb-6">
							<div className="flex-1 relative">
								<input
									type="text"
									ref={inputRef}
									placeholder="Enter city name..."
									onKeyDown={handleKeyDown}
									className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 shadow-sm"
									aria-label="Enter city name to search weather"
								/>
							</div>
							<button
								onClick={fetchWeather}
								disabled={loading}
								aria-label="Search weather"
								className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-105 active:scale-95"
							>
								{loading ? (
									<svg
										className="w-5 h-5 animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								)}
							</button>
						</div>

						{/* Weather display container with smooth height transition */}
						<div
							className={`duration-500 ease-in-out overflow-hidden transition-all ${
								showWeather ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
							}`}
						>
							{loading ? (
								<div className="flex flex-col items-center justify-center py-16">
									<div className="relative">
										<div className="w-16 h-16 border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-500 dark:border-t-cyan-400 rounded-full animate-spin"></div>
									</div>
									<p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
										Loading weather data...
									</p>
								</div>
							) : (
								showWeather && (
									<div className="text-center flex flex-col gap-6 py-4 animate-fadeIn">
										{/* Location name */}
										{apiData && (
											<div className="space-y-1">
												<p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
													{apiData.name}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{apiData.sys?.country}
												</p>
											</div>
										)}

										{/* Weather icon with animation */}
										<div className="flex justify-center">
											<img
												src={showWeather[0]?.img}
												alt={`${showWeather[0]?.type} weather icon`}
												className="w-40 h-40 md:w-48 md:h-48 drop-shadow-lg animate-float"
											/>
										</div>

										{/* Weather type */}
										<h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
											{showWeather[0]?.type}
										</h3>

										{/* Temperature display */}
										{apiData && (
											<div className="space-y-4">
												<div className="flex items-center justify-center gap-3">
													<div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-2xl">
														<svg
															className="w-8 h-8 text-cyan-600 dark:text-cyan-400"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
																clipRule="evenodd"
															/>
														</svg>
													</div>
													<h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
														{Math.round(apiData.main?.temp)}&#176;
													</h2>
												</div>
												<div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full">
													<p className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
														{getTemperatureDescription(apiData.main?.temp)}
													</p>
												</div>

												{/* Additional weather info */}
												<div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
													<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
														<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
															Feels Like
														</p>
														<p className="text-lg font-bold text-gray-800 dark:text-gray-200">
															{Math.round(apiData.main?.feels_like)}&#176;
														</p>
													</div>
													<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
														<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
															Humidity
														</p>
														<p className="text-lg font-bold text-gray-800 dark:text-gray-200">
															{apiData.main?.humidity}%
														</p>
													</div>
												</div>
											</div>
										)}
									</div>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
