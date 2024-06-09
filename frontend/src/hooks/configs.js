// This is subscribe APIs.
import {useEffect, useRef, useState} from 'react';

import debugLog from '../libs/log';
import {getSystemInfo, getMemInfo, getCpuInfo} from '../libs/services';

export const useConfigs = () => {
	const ref = useRef(null);
	const [value, setValue] = useState({returnValue: false});

	useEffect(() => {
		if (!ref.current) {
			debugLog('GET_CONFIGS[R]', {});
			ref.current = getSystemInfo({
				parameters: {
					subscribe: true,
					keys: ['modelName', 'firmwareVersion', 'UHD', 'sdkVersion']
				},
				onSuccess: res => {
					debugLog('GET_CONFIGS[S]', res);
					setValue(res);
				},
				onFailure: err => {
					debugLog('GET_CONFIGS[F]', err);
				}
			});
		}

		return () => {
			if (ref.current) {
				ref.current.cancel();
				ref.current = null;
			}
		};
	}, []);

	return value;
};

export const useMemConfigs = () => {
	const ref = useRef(null);
	const [value, setValue] = useState({returnValue: false});

	useEffect(() => {
		if (!ref.current) {
			debugLog('GET_MEMCONFIGS[R]', {});
			ref.current = getMemInfo({
				parameters: {
					subscribe: true,
				},
				onSuccess: res => {
					debugLog('GET_MEMCONFIGS[S]', res);
					setValue(res);
				},
				onFailure: err => {
					debugLog('GET_MEMCONFIGS[F]', err);
				}
			});
		}

		return () => {
			if (ref.current) {
				ref.current.cancel();
				ref.current = null;
			}
		};
	}, []);

	return value;
};

export const useCpuConfigs = () => {
	const ref = useRef(null);
	const [value, setValue] = useState({returnValue: false});

	useEffect(() => {
		if (!ref.current) {
			debugLog('GET_CPUCONFIGS[R]', {});
			ref.current = getCpuInfo({
				parameters: {
					subscribe: true,
				},
				onSuccess: res => {
					debugLog('GET_CPUCONFIGS[S]', res);
					setValue(res);
				},
				onFailure: err => {
					debugLog('GET_CPUCONFIGS[F]', err);
				}
			});
		}

		return () => {
			if (ref.current) {
				ref.current.cancel();
				ref.current = null;
			}
		};
	}, []);

	return value;
};