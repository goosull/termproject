import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {Header, Panel} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Account from './Account';
import SketchList from './SketchList';
import System from './System';


const Main = props => {
	return (
		<Panel {...props}>
			<Header title={$L('Sketch App')} />
			<TabLayout>
				<Tab title={$L('Sketch')}>
					<SketchList />
				</Tab>
				<Tab title={$L('Account')}>
					<Account />
				</Tab>
				<Tab title={$L('System')}>
					<System />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
