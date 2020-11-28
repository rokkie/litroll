const worker = new Worker('./worker-impl.ts', { name: 'store-worker', type: 'module' });

export default worker;
