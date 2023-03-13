// Since state management runs in a worker we want to be able to obtain a reference to this worker
// from pretty much everywhere in the UI thread, essentially making it a singleton.
// The easiest way to do this is, is to make it to only single export of a module which can then
// be imported anywhere. The fact that it's a module guarantees that you always get the same reference.

const worker = new Worker(new URL('./worker-impl.mts', import.meta.url), { name: 'store-worker', type: 'module' });

export default worker;
