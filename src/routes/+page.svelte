<script lang="ts">
	let data = {
        input: {
            respondents_number: 5,
            subjects: ['Предмет 1', 'Предмет 2', 'Предмет 3'],
            criteria: [
                { name: "Критерий 1",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 2",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 3",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 4",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 5",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 6",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 7",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 8",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 9",  weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
                { name: "Критерий 10", weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
            ]
        },
        generated: [] as any
    };

    function randomIntFromInterval(min: number, max: number) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


	function generate() {
        let result = []
        for (let respondent_idx = 0; respondent_idx < data.input.respondents_number; respondent_idx++) {
            let form = { name: `Респондент ${respondent_idx + 1}`, subjects: [] as any }
            form.subjects = data.input.subjects.map(subj => {
                return {
                    name: subj,
                    criteria: data.input.criteria.map(criterion => {
                        return {
                            weight: randomIntFromInterval(criterion.weight_min, criterion.weight_max),
                            score:  randomIntFromInterval(criterion.score_min,  criterion.score_max),
                        }
                    })
                }
            })
            result.push(form);
        }
        data.generated = result;
    }
</script>
<pre>{ JSON.stringify(data, null, 2) }</pre>
<button on:click="{generate}">Генерировать</button>
