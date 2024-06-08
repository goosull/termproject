import BodyText from '@enact/sandstone/BodyText';
import $L from '@enact/i18n/$L';
import {useConfigs} from '../hooks/configs';

const System = () => {
	const data = useConfigs();
	return (
		<>
			<BodyText>{$L('This is page for system monitoring.')}</BodyText>
			<BodyText>{`TV Info : ${JSON.stringify(data)}`}</BodyText>
		</>
	);
};

export default System;