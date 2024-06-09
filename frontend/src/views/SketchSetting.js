import { stateContext, indexContext} from '../App/Context';
import { useCallback, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import LoginInfo from '../App/LoginInfo';
import Popup from '@enact/sandstone/Popup'
import $L from '@enact/i18n/$L';

const SketchSetting = () => {
    const {state, setState} = useContext(stateContext);
	const [share, setShare] = useState('');
	const [canvasinfo, setCanvas] = useState();
    const index = useContext(indexContext);
	const [sharePopup, sharePopupOpen] = useState(false);
	const [savePopup, savePopupOpen] = useState(false);
	const [namePopup, namePopupOpen] = useState(false);

    useEffect(()=>{
        fetchList();
		fetchCanvas();
    }, []);

    // Delete saved canvas
	const deleteCanvas = useCallback(() => {
		if (state.id != null) {
			axios
				.delete('/api/canvas/'+state.id)
				.then(()=>{setState(prevState=>({...prevState, title: '', id: null}))})
				.catch(error => console.error(error));
		}
        index.setIndex(0);

	}, [state]);

    // Load all canvas of user
	const fetchList = async() => {
		try {
			const response = await axios.get('/api/canvas/?user='+LoginInfo.name);
			setState(prevState=>({...prevState,  canvasList: response.data}));
		} catch (error) {
			console.log(error);
		}
	}

	const fetchCanvas = async() => {
		if (state.id){
			try {
				const response = await axios.get('/api/canvas/'+state.id);
				setCanvas(response.data);
			} catch (error) {
				console.log(error);
			}
		}
	}

	const shareCanvas = useCallback(()=>{
		if (canvasinfo && (!canvasinfo.user.includes(share)) && (!share == '')) {
			if (state.id) {
				axios
				.put('/api/canvas/share/'+state.id, {name: share})
				.then(()=>{fetchList();fetchCanvas();})
				.then(()=>{sharePopupOpen(true)})
				.catch(err=>console.error(err));
			}
		} else {
			if (!canvasinfo) savePopupOpen(true);
			else if (!((!canvasinfo.user.includes(share)) && (!share == ''))) namePopupOpen(true);
		}
	});

	const withdraw = useCallback((user)=>{
		axios
			.put('/api/canvas/'+state.id, {user:canvasinfo.user.filter(u=>u!=user)})
			.then(()=>{fetchList();fetchCanvas();})
			.catch(err=>console.error(err))
		if (user == LoginInfo.name)
			if (canvasinfo.user.length==1) {
				deleteCanvas();
				fetchList();
			} else {
				fetchList();
				index.setIndex(0);
			}
	})

    return (
		<div>
			{LoginInfo.name ? (
				<div>
					<h2> {$L('Share Sketch')} </h2>
					<InputField
						type="text"
						value={share}
						onChange={(e=>setShare(e.value))}
						placeholder="User Name"
					/>
					<Button
						icon="share"
						iconOnly
						onClick={shareCanvas}>
					</Button>
					{canvasinfo && Array.isArray(canvasinfo.user) ? (
							<div>
								<h2>{$L('Collaborator')}</h2>
								<ul>
									{canvasinfo.user.map(u => (
										<li key={u}>
											{u}
											<Button
											icon='minus'
											iconOnly
											onClick={()=>withdraw(u)}
											>
											</Button>
										</li>
									))}
								</ul>
							</div>
						):(
							<div></div>
						)
					}
				</div>
			) : (
				<div></div>
			)}
			<div>
				<Button
					icon="trash"
					onClick={deleteCanvas}>
					{$L('Delete this sketch')}
				</Button>
			</div>
			<Popup type="overlay" open={sharePopup} onClose={()=>sharePopupOpen(false)}>
				<span>{$L('Shared with'+share+'.')}</span>
			</Popup>
			<Popup type="overlay" open={savePopup} onClose={()=>savePopupOpen(false)}>
				<span>{$L('This sketch is not saved. Please save before share.')}</span>
			</Popup>
			<Popup type="overlay" open={namePopup} onClose={()=>namePopupOpen(false)}>
				<span>{$L('Please check user name.')}</span>
			</Popup>
        </div>
    )
}

export default SketchSetting;