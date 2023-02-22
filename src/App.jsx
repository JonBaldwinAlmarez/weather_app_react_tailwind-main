import { useRef, useState } from "react";

const Api_key = "5c86490ff1685b81ccc2dcc182a48a32";

const App = () => {
	const inputRef = useRef(null);
	const [apiData, setApiData] = useState(null);
	const [showWeather, setShowWeather] = useState(null);

	const [loading, setLoading] = useState(false);

	const WeatherTypes = [
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

	const fetchWeather = async () => {
		const URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&units=metric&appid=${Api_key}`;
		setLoading(true);
		fetch(URL)
			.then((res) => res.json())
			.then((data) => {
				setApiData(null);
				if (data.cod == 404 || data.cod == 400) {
					// ARRAY OF OBJ
					setShowWeather([
						{
							type: "Not Found",
							img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
						},
					]);
				}
				setShowWeather(
					WeatherTypes.filter(
						(weather) => weather.type === data.weather[0].main
					)
				);
				console.log(data);
				setApiData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<div className="bg-zinc-800 h-screen grid place-items-center">
			<div className="bg-cyan-100 w-96 p-4 rounded-md">
				<div className="flex items-center justify-between">
					<input
						type="text"
						ref={inputRef}
						placeholder="Enter Your Location"
						className="text-xl border-b
          p-1 border-gray-800 font-semibold uppercase flex-1 rounded-lg"
					/>
					<button onClick={fetchWeather}>
						<img
							src="https://cdn-icons-png.flaticon.com/512/758/758651.png"
							alt="..."
							className="w-8 p-1"
						/>
					</button>
				</div>
				<div
					className={`duration-300 delay-75  overflow-hidden
         ${showWeather ? "h-[27rem]" : "h-0"}`}
				>
					{loading ? (
						<div className="grid place-items-center h-full">
							<img
								src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
								alt="..."
								className="w-14 mx-auto mb-2 animate-spin"
							/>
						</div>
					) : (
						showWeather && (
							<div className="text-center flex flex-col gap-6 mt-10">
								{apiData && (
									<p className="text-xl font-semibold">
										{apiData?.name + ", " + apiData?.sys?.country}
									</p>
								)}
								<img
									src={showWeather[0]?.img}
									alt="..."
									className="w-52 mx-auto"
								/>
								<h3 className="text-2xl font-bold text-zinc-800">
									{showWeather[0]?.type}
								</h3>

								{apiData && (
									<>
										<div className="flex justify-center">
											<img
												src="https://cdn-icons-png.flaticon.com/128/3815/3815449.png"
												alt="..."
												className="h-9 mt-1"
											/>
											<h2 className="text-4xl font-extrabold mx-5">
												{apiData?.main?.temp} &#176;C
											</h2>
											<h2 className=" py-2 font-bold">
												{apiData.main.temp <= 0
													? "Below Zero"
													: apiData.main.temp < 20 && apiData.main.temp >= 1
													? "Cold"
													: apiData.main.temp > 21 && apiData.main.temp <= 30
													? "Warm"
													: apiData.main.temp >= 30 && apiData.main.temp <= 35
													? "Hot"
													: "Very Hot"}
											</h2>
										</div>
									</>
								)}
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
