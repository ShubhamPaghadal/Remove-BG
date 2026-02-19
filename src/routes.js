const routes = {
	// public routes
	home: '/',
	howToUse: '/#how-to-use',
	pricing: '/pricing',
	contact: '/contact',
	changePassword: '/change-password/:token',
	termsAndConditions: '/terms-and-conditions',
	privacyPolicy: '/privacy-policy',
	cookiesPolicy: '/cookies-policy',
	gdpr: '/gdpr',
	faq: '/faq',
	upload: '/upload',
	unsubscribe: '/unsubscribe',
	// protected routes
	dashboard: '/app/dashboard',
	editor: '/app/editor',
	billing: '/app/billing',
	myImages: '/app/my-images',
	myAccount: '/app/my-account',
	checkout: '/app/checkout',
	paymentMethod: '/app/billing/payment-method',
	fastCheckout: '/app/editor/payment',
	fastCheckoutDashboard: '/app/dashboard/payment',
	users: '/app/users'
};

export default routes;
