export const Loading = () => {
	return (
		<svg className="block h-24 w-24" viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="loader-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
					<stop offset="0%" stopColor="hsl(var(--primary))" />
					<stop offset="100%" stopColor="hsl(var(--secondary))" />
				</linearGradient>
				<linearGradient id="loader-grad2" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="hsl(var(--primary))" />
					<stop offset="100%" stopColor="hsl(var(--secondary))" />
				</linearGradient>
			</defs>
			<circle
				className="animate-dotring"
				cx="100"
				cy="100"
				r="82"
				fill="none"
				stroke="url(#loader-grad1)"
				strokeWidth="36"
				strokeDasharray="0 257 1 257"
				strokeDashoffset="0.01"
				strokeLinecap="round"
				transform="rotate(-90,100,100)"
			/>
			<line
				className="animate-dropbounce"
				stroke="url(#loader-grad2)"
				x1="100"
				y1="18"
				x2="100.01"
				y2="182"
				strokeWidth="36"
				strokeDasharray="1 165"
				strokeLinecap="round"
			/>
		</svg>
	);
};
