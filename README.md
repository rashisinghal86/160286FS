Skill Ordering App# 160286FS
async create_csv() {
            try {
                const response = await fetch(location.origin+'/create_csv', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const task_id = (await response.json()).task_id;
                const interval = setInterval(async () => {
                    const response = await fetch(location.origin+'/get_csv?task_id=' + task_id);
    
                if (response.ok) {
                    console.log('csv created');
                    window.open(location.origin+'/get_csv?task_id=' + task_id);
                    clearInterval(interval)
                }
            }
            , 1000);
        } catch (error) {
            console.error('CSV creation failed', error);
        }
              <button class="btn btn-primary" @click="create_csv">get</button>
