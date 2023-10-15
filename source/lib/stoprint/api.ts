import {mobileReleaseApi, papercutApi} from './urls'
import {encode} from 'base-64'
import {
	fetchAllPrinters as mockFetchAllPrinters,
	fetchJobs as mockFetchJobs,
	fetchRecentPrinters as mockFetchRecentPrinters,
	heldJobsAvailableAtPrinterForUser as mockHeldJobsAvailableAtPrinterForUser,
	logIn as mockLogIn,
	releasePrintJobToPrinterForUser as mockReleasePrintJobToPrinterForUser,
} from './__mocks__/api'

import type {
	AllPrintersResponse,
	CancelResponse,
	ColorPrintersResponse,
	HeldJobsResponse,
	LoginResponse,
	PrintJobsResponse,
	RecentPopularPrintersResponse,
	ReleaseResponse,
} from './types'
import {Options} from 'ky'
import {SharedWebCredentials} from 'react-native-keychain'
import {LoginFailedError} from '../login'
import {client} from '@frogpond/api'

export class PapercutJobReleaseError extends Error {}

export async function logIn(
	credentials: SharedWebCredentials,
	options: Options,
	now: number = new Date().getTime(),
	useMockPrintData = false,
): Promise<void> {
	let {username, password} = credentials

	if (useMockPrintData) {
		return mockLogIn(credentials, now, useMockPrintData)
	}

	const result = (await papercutApi
		.post(`webclient/users/${username}/log-in`, {
			...options,
			// use URLSearchParams to auto-set Content-Type: application/x-www-form-urlencoded
			body: new URLSearchParams({password: encode(password)}),
			searchParams: {nocache: String(now)},
		})
		.json()) as LoginResponse

	if (!result.success) {
		throw new LoginFailedError()
	}

	return
}

export async function fetchJobs(
	username: string,
	options: Options,
	useMockPrintData = false,
): Promise<PrintJobsResponse> {
	if (useMockPrintData) {
		return mockFetchJobs(username)
	}

	return (await papercutApi
		.get(`webclient/users/${username}/jobs/status`, options)
		.json()) as PrintJobsResponse
}

export async function fetchAllPrinters(
	username: string,
	options: Options,
	useMockPrintData = false,
): Promise<AllPrintersResponse> {
	if (useMockPrintData) {
		return mockFetchAllPrinters(username)
	}

	return (await mobileReleaseApi
		.get('all-printers', {
			...options,
			searchParams: {username: username},
		})
		.json()) as AllPrintersResponse
}

export async function fetchRecentPrinters(
	username: string,
	options: Options,
	useMockPrintData = false,
): Promise<RecentPopularPrintersResponse> {
	if (useMockPrintData) {
		return mockFetchRecentPrinters(username)
	}

	return (await mobileReleaseApi
		.get('recent-popular-printers', {
			...options,
			searchParams: {username: username},
		})
		.json()) as RecentPopularPrintersResponse
}

export async function fetchColorPrinters(
	options: Options,
	useMockPrintData = false,
): Promise<string[]> {
	if (useMockPrintData) {
		return ['mfc-rml-4-disco', 'mfc-toh101']
	}

	let response = (await client
		.get('color-printers', options)
		.json()) as ColorPrintersResponse
	return response.data.colorPrinters
}

export async function heldJobsAvailableAtPrinterForUser(
	printerName: string,
	username: string,
	options: Options,
	useMockPrintData = false,
): Promise<HeldJobsResponse> {
	// https://PAPERCUT_API.stolaf.edu/rpc/api/rest/internal/mobilerelease/api/held-jobs/?username=rives&printerName=printers%5Cmfc-it
	if (useMockPrintData) {
		return mockHeldJobsAvailableAtPrinterForUser(printerName, username)
	}

	return (await mobileReleaseApi
		.get('held-jobs', {
			...options,
			searchParams: {
				username: username,
				printerName: `printers\\${printerName}`,
			},
		})
		.json()) as HeldJobsResponse
}

export async function cancelPrintJobForUser(
	jobId: string,
	username: string,
	options: Options,
): Promise<CancelResponse> {
	return (await mobileReleaseApi
		.post('held-jobs/cancel', {
			...options,
			searchParams: {username: username},
			// use URLSearchParams to auto-set Content-Type: application/x-www-form-urlencoded
			body: new URLSearchParams({'jobIds[]': jobId}),
		})
		.json()) as CancelResponse
}

type PrintJobReleaseArgs = {
	jobId: string
	printerName: string
	username: string
}

export async function releasePrintJobToPrinterForUser(
	{jobId, printerName, username}: PrintJobReleaseArgs,
	options: Options,
	useMockPrintData = false,
): Promise<ReleaseResponse> {
	if (useMockPrintData) {
		return mockReleasePrintJobToPrinterForUser({jobId, printerName, username})
	}

	let response = (await mobileReleaseApi
		.post('held-jobs/release', {
			...options,
			searchParams: {username: username},
			// use URLSearchParams to auto-set Content-Type: application/x-www-form-urlencoded
			body: new URLSearchParams({
				printerName: `printers\\${printerName}`,
				'jobIds[]': jobId,
			}),
		})
		.json()) as ReleaseResponse

	if (response.numJobsReleased === 0) {
		throw new PapercutJobReleaseError()
	}

	return response
}
