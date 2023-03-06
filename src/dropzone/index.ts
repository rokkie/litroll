import { html } from 'lit-html';
import style from './dropzone.module.scss';
import worker from '../store/worker-inst';
import image from '../image';
import { createLoadImgMsg, selectUrlOrig } from '../store/my-slice';

export default (state) => {
  const url = selectUrlOrig(state);

  return html`
    <div class="${style.dropzone} ${url ? style.hasImage: ''}"
         @dragover="${onDragOver}"
         @dragenter="${onDragEnter}"
         @dragleave="${onDragLeave}"
         @drop="${onDrop}">
      ${url ? image(url) : hint()}
    </div>
  `;
};

const hint = () => html`
  <div>
    <p>Drop an image file here</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  </div>
`;

/**
 * Event handler for when a file is dropped
 *
 * Sends a message to the worker that loads to image.
 *
 * @param evt The event
 */
const onDrop = async (evt: DragEvent) => {
  toggleDragOverClass(evt, false);

  // check if the file is an image
  if (!evt.dataTransfer.files[0].type.match(/^image\//)) return;

  // create message from the image in the event data
  const msg = createLoadImgMsg(evt.dataTransfer.files[0]);

  // send message to the worker
  worker.postMessage(msg);
};

/**
 * Event handler for when dragged file is over the drop zone
 *
 * Prevents file from being opened.
 *
 * @param evt
 */
const onDragOver = (evt: DragEvent) => {
  evt.preventDefault();
};

/**
 * Event handler for when dragged file enters the dropzone
 *
 * Adds dragover class to dropzone element
 *
 * @param evt
 */
const onDragEnter = (evt: DragEvent) => toggleDragOverClass(evt, true);

/**
 * Event handler for when dragged file leaves the dropzone
 *
 * Removes dragover class from dropzone element
 *
 * @param evt
 */
const onDragLeave = (evt: DragEvent) => toggleDragOverClass(evt, false);

/**
 * Toggle dragover class of dropzone element
 *
 * Adds or removes dragover class to/from dropzone element based on flag.
 * Additionally prevents default behaviour of passed drag event.
 *
 * @param evt
 * @param flag
 */
const toggleDragOverClass = (evt: DragEvent, flag: boolean) => {
  evt.preventDefault();

  const el = evt.target as Element;

  el.classList.toggle(style.dragover, flag);
};
