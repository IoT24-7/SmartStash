<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Link } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	

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

	let visible = false;
	let toggleButton = "More information";
    function toggleVisible() {
        visible = !visible
		if (toggleButton == "More information") {
			toggleButton = "Less information";
		} else {
			toggleButton = "More information";
		}
    }

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>

		<Form.Field {form} name="foodName">
			<Form.Control let:attrs>
				<Form.Label>Ingredient Name*</Form.Label>
				<Input {...attrs} bind:value={$formData.foodName} />
			</Form.Control>
			<Form.Description>This is the ingredient stored inside the container.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="macAddress">
			<Form.Control let:attrs>
				<Form.Label>MAC Address*</Form.Label>
				<Input {...attrs} bind:value={$formData.macAddress} />
			</Form.Control>
			<Form.Description>This is the ID unique to your SmartStash device.</Form.Description>
			<Form.FieldErrors let:errors let:errorAttrs>
				{#each errors as err}
					<span {...errorAttrs}>Invalid MAC Address</span>
				{/each}
			</Form.FieldErrors>
		</Form.Field>
	
		<Button on:click={toggleVisible} class="w-full" variant="outline">
			{toggleButton}
		</Button>
		
		{#if visible}
			<div class="overflow-scroll h-20">
				<Form.Field {form} name="pricePesos">
					<Form.Control let:attrs>
						<Form.Label>Price (per serving)</Form.Label>
						<Input {...attrs} bind:value={$formData.pricePesos} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="carbohydrates">
					<Form.Control let:attrs>
						<Form.Label>Carbohydrates (per serving)</Form.Label>
						<Input {...attrs} bind:value={$formData.carbohydrates} />
					</Form.Control>
					
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="proteins">
					<Form.Control let:attrs>
						<Form.Label>Proteins (per serving)</Form.Label>
						<Input {...attrs} bind:value={$formData.proteins} />
					</Form.Control>
					
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="fats">
					<Form.Control let:attrs>
						<Form.Label>Fats (per serving)</Form.Label>
						<Input {...attrs} bind:value={$formData.fats} />
					</Form.Control>
					
					<Form.FieldErrors />
				</Form.Field>
			</div>
			
		{/if}
		
		<Form.Button><Link class="mr-2 h-4 w-4"/>Connect</Form.Button>
	
	
</form>
