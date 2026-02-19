export function CfCaptchaWidget({
	id = 'cf-turnstile-widget',
	style,
	...props
}) {
	return (
		<div
			id={id}
			style={{
				marginTop: 20,
				marginInlineStart: { sm: 'unset', md: -20 },
				textAlign: 'center',
				...style
			}}
			{...props}
		/>
	);
}
