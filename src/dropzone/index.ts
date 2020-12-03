import { html } from 'lit-html';
import style from './dropzone.module.scss';
import worker from '../store/worker-inst';
import { loadimg } from '../store/my-slice';

export default () => html`
  <div class="${style.dropzone}" @dragenter="${onDragEnter}" @dragover="${onDragOver}" @drop="${onDrop}">
    drop stuff
  </div>
`;

const onDrop = async (evt: DragEvent) => {
  evt.preventDefault();

  // check if the file is an image
  if (!evt.dataTransfer.files[0].type.match(/^image\//)) return;

  // create action from image bytes
  const img = evt.dataTransfer.files[0];
  const buf = await img.arrayBuffer();
  const action = loadimg({ buf, type: img.type });

  // send action to worker, relinquishing control of the image
  worker.postMessage(action, [buf]);
};

const onDragEnter = (evt: DragEvent) => {
  evt.preventDefault();
};

const onDragOver = (evt: DragEvent) => {
  evt.preventDefault();
};
