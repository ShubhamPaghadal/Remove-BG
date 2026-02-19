import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '@/routes';

import {
	CheckoutLayout,
	PrivateLayout,
	PublicLayout,
	SharedLayout,
	MinimalLayout,
	LocalizedLayout
} from '@/layouts';

import { Dashboard } from '@/pages/private/dashboard';
import { Billing } from '@/pages/private/billing';
import { MyImages } from '@/pages/private/my-images';
import { MyAccount } from '@/pages/private/my-account';
import { Editor } from '@/pages/private/editor';
import { Users } from '@/pages/private/users';
import { Home } from '@/pages/public/home';
import { ChangePasswordRedirect } from '@/pages/ChangePasswordRedirect';
import NotFound from '@/pages/NotFound';
import { Pricing } from '@/pages/public/pricing';
import { Contact } from '@/pages/public/contact';
import { TermsAndConditions } from '@/pages/public/terms-and-conditions';
import { PrivacyPolicy } from '@/pages/public/privacy-policy';
import { Faq } from '@/pages/public/faq';
import { GDPR } from '@/pages/public/gdpr';
import { CookiesPolicy } from '@/pages/public/cookies-policy';
import { Unsubscribe } from '@/pages/public/unsubscribe';

import ErrorBoundary from './ErrorBoundary';
import { addLangParam } from './utils';

// IMPORTANT: define the route id for setting the document title automatically
const router = createBrowserRouter([
	{
		path: '/',
		element: <PublicLayout />,
		children: [
			{
				path: '/',
				element: <LocalizedLayout />,
				children: [
					{
						id: 'home',
						path: addLangParam('/'),
						element: <Home />
					},
					{
						id: 'how-to-use',
						path: addLangParam(routes.howToUse),
						element: <Home />
					},
					{
						id: 'pricing',
						path: addLangParam(routes.pricing),
						element: <Pricing />
					},
					{
						id: 'contact',
						path: addLangParam(routes.contact),
						element: <Contact />
					},
					{
						id: 'faq',
						path: addLangParam(routes.faq),
						element: <Faq />
					},
					{
						id: 'terms-and-conditions',
						path: addLangParam(routes.termsAndConditions),
						element: <TermsAndConditions />
					},
					{
						id: 'privacy-policy',
						path: addLangParam(routes.privacyPolicy),
						element: <PrivacyPolicy />
					},
					{
						id: 'gdpr',
						path: addLangParam(routes.gdpr),
						element: <GDPR />
					},
					{
						id: 'cookies-policy',
						path: addLangParam(routes.cookiesPolicy),
						element: <CookiesPolicy />
					},
					{
						id: 'unsubscribe',
						path: addLangParam(routes.unsubscribe),
						element: <Unsubscribe />
					}
				]
			}
		]
	},
	{
		path: '/',
		element: <PrivateLayout />,
		children: [
			{
				id: 'dashboard',
				path: routes.dashboard,
				element: <Dashboard />,
				children: [
					{
						path: routes.fastCheckoutDashboard,
						element: <Dashboard />
					}
				]
			},
			{
				id: 'myImages',
				path: routes.myImages,
				element: <MyImages />
			},
			{
				id: 'billing',
				path: routes.billing,
				element: <Billing />,
				children: [
					{
						path: routes.paymentMethod,
						element: <Billing />
					}
				]
			},
			{
				id: 'users',
				path: routes.users,
				element: <Users />
			},
			{
				id: 'myAccount',
				path: routes.myAccount,
				element: <MyAccount />
			}
		]
	},
	{
		path: '/',
		element: <SharedLayout />,
		children: [
			{
				id: 'editor',
				path: routes.editor,
				element: <Editor />,
				children: [
					{
						path: routes.fastCheckout,
						element: <Editor />
					}
				]
			}
		]
	},
	{
		path: '/',
		element: <MinimalLayout />,
		children: [
			{
				path: '/',
				element: <LocalizedLayout />,
				children: [
					{
						id: 'upload',
						path: addLangParam(routes.upload),
						element: <Dashboard />
					}
				]
			}
		]
	},
	{
		path: '/',
		errorElement: <ErrorBoundary />,
		element: <CheckoutLayout />,
		children: [
			{
				id: 'checkout',
				path: routes.checkout,
				async lazy() {
					const { Checkout } = await import('@/pages/private/checkout');
					return { Component: Checkout };
				}
			}
		]
	},
	{
		path: routes.changePassword,
		element: <ChangePasswordRedirect />
	},
	{
		path: '*',
		element: <PublicLayout />,
		children: [
			{
				id: 'notFound',
				path: '*',
				// if the route has a single child path,
				// NotFound component will be rendered inside <LocalizedLayout />
				element: <NotFound />
			}
		]
	}
]);

function Router() {
	return <RouterProvider router={router} />;
}

export default Router;
