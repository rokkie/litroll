import { html } from 'lit-html';
import style from './dropzone.module.scss';
import worker from '../store/worker-inst';

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

  // send action to worker, relinquishing control of the image
  worker.postMessage({ type: '**custom/onimagedrop', img });
};

const onDragEnter = (evt: DragEvent) => {
  evt.preventDefault();
};

const onDragOver = (evt: DragEvent) => {
  evt.preventDefault();
};
