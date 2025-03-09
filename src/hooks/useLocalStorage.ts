import { useState, useCallback, useEffect } from 'react';

export const useLocalStorage = <T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const newValue = value instanceof Function ? value(storedValue) : value;
				window.localStorage.setItem(key, JSON.stringify(newValue));
				setStoredValue(newValue);
				window.dispatchEvent(new Event('local-storage'));
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue],
	);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent): void => {
			if (event.key === key && event.newValue) {
				try {
					const parsedValue = JSON.parse(event.newValue) as T;
					setStoredValue(parsedValue);
				} catch (error) {
					console.error('Error parsing stored value', error);
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key]);

	return [storedValue, setValue] as const;
};
