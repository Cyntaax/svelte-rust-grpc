<script>
	import { onMount } from 'svelte';
	import { MainClientImpl, Normal, Blank, GrpcWebImpl } from '$lib/rpc';

	const rpc = new GrpcWebImpl('http://localhost:5174', {});
	const client = new MainClientImpl(rpc);

	onMount(() => {
		const data = Normal.create({ id: 1 });

		client
			.Test(data)
			.then((res) => {
				console.log('response', res);
			})
			.catch((e) => {
				console.error('error', e);
			});
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
