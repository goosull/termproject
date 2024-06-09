import BodyText from '@enact/sandstone/BodyText';
import $L from '@enact/i18n/$L';
import {useConfigs, useCpuConfigs, useMemConfigs} from '../hooks/configs';

const System = () => {
	const data = useConfigs();
	const cpu_data = useCpuConfigs();
	const mem_data = useMemConfigs();
	return (
		<>
			<BodyText>{$L('This is page for system monitoring.')}</BodyText>
			{(data.modelName) ? (
			<BodyText>{'Model Name : '+data.modelName}</BodyText>
			) : (<BodyText></BodyText>)}
			{(cpu_data.stat) ? (
			<BodyText>{'CPU Info : '+cpu_data.stat[0]}</BodyText>
			) : (<BodyText></BodyText>)}
			{(mem_data.usable_memory) ? (
			<BodyText>{'Usable Memory : '+mem_data.usable_memory+'MB'}</BodyText>
			) : (<BodyText></BodyText>)}
			{(mem_data.swapUsed) ? (
			<BodyText>{'Swap Used : '+mem_data.swapUsed+'MB'}</BodyText>
			) : (<BodyText></BodyText>)}
		</>
	);
};

export default System;