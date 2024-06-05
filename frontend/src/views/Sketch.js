import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import Switch from '@enact/sandstone/Switch';
import {fabric} from 'fabric';

const Sketch = () => {
	const [canvas, setCanvas] = useState();
	const [isDrawingMode, setIsDrawingMode] = useState(true);
	const bgColor = useRef('#FFFFFF');

	useEffect(() => {
		setCanvas(
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
				isDrawingMode: true
			})
		);
	}, []);

	const clearCanvas = useCallback(() => {
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
	}, [canvas]);

	const downloadCanvas = useCallback(() => {}, []);

	// Delete selected object
	const handleDelete = useCallback(() => {
		if (canvas){
			const activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.remove(activeObject);
				canvas.renderAll();
			}
		}
	}, [canvas]);

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Delete' || event.key === 'Backspace') {
				handleDelete();
			}
		});
	}, [handleDelete]);

	return (
		<div>
			<Button
				icon="trash"
				iconOnly
				backgroundOpacity="opaque"
				onClick={clearCanvas}
			/>
			<Button
				icon="download"
				iconOnly
				backgroundOpacity="opaque"
				onClick={downloadCanvas}
			/>
			<span style={{ marginLeft: '10px' }}>Drawing Mode</span>
			<Switch
				backgroundOpacity="opaque"
				selected={isDrawingMode}
				onClick={() => {
					setIsDrawingMode(!isDrawingMode);
					canvas.isDrawingMode = !isDrawingMode;
				}}
			/>

			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;
