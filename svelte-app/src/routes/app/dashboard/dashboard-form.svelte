<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success('The SmartStash device is connected successfully!', {
					description: `${f.data.macAddress} is assigned as ${f.data.foodName}`,
					action: {
						label: 'OK',
						onClick: () => console.info('OK')
					}
				});
			}
			// 	toast.success(`You have successfully added ${f.data.foodName} container!`);
			// }
			else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="foodName">
		<Form.Control let:attrs>
			<Form.Label>Ingredient Name</Form.Label>
			<Input {...attrs} bind:value={$formData.foodName} />
		</Form.Control>
		<Form.Description>This is the ingredient stored inside the container.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="macAddress">
		<Form.Control let:attrs>
			<Form.Label>MAC Address</Form.Label>
			<Input {...attrs} bind:value={$formData.macAddress} />
		</Form.Control>
		<Form.Description>This is the ID unique to your SmartStash device.</Form.Description>
		<Form.FieldErrors let:errors let:errorAttrs>
			{#each errors as err}
				<span {...errorAttrs}>Invalid MAC Address</span>
			{/each}
		</Form.FieldErrors>
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
