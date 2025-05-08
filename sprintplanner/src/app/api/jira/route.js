import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received data for Jira:', data);
    
    // Get environment variables
    const jiraApiKey = process.env.JIRA_API_KEY;
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY;
    
    // Validate required variables
    if (!jiraApiKey || !jiraEmail) {
      console.error('Jira API key or email is missing in environment variables');
      return NextResponse.json(
        { success: false, error: 'Jira credentials are incomplete' },
        { status: 400 }
      );
    }
    
    // Set up authentication headers
    const auth = Buffer.from(`${jiraEmail}:${jiraApiKey}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    try {
      // Test the connection first
      const testResponse = await fetch(`${jiraBaseUrl}/rest/api/3/myself`, {
        method: 'GET',
        headers
      });
      
      if (!testResponse.ok) {
        throw new Error(`Jira connection failed (${testResponse.status})`);
      }

      // Create tasks
      const tasks = [];
      
      // Process each task from the request
      for (const task of data.tasks) {
        try {
          const taskResponse = await fetch(`${jiraBaseUrl}/rest/api/3/issue`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              fields: {
                project: { key: jiraProjectKey },
                summary: task,
                description: {
                  type: "doc",
                  version: 1,
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: task }]
                    }
                  ]
                },
                issuetype: { name: "Task" }
              }
            })
          });
          
          if (!taskResponse.ok) {
            console.error(`Failed to create task: ${await taskResponse.text()}`);
            continue;
          }
          
          const taskData = await taskResponse.json();
          tasks.push({
            key: taskData.key,
            type: 'Task',
            summary: task,
            url: `${jiraBaseUrl}/browse/${taskData.key}`
          });
        } catch (taskErr) {
          console.error(`Error creating task: ${taskErr.message}`);
          continue;
        }
      }
      
      if (tasks.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Tasks created successfully in Jira',
          data: {
            key: jiraProjectKey,
            created: new Date().toISOString(),
            viewUrl: `${jiraBaseUrl}/jira/software/projects/${jiraProjectKey}/boards`,
            tasks
          }
        });
      } else {
        throw new Error('Failed to create any tasks in JIRA');
      }
    } catch (error) {
      console.error('Error processing Jira request:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in Jira API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create tasks in Jira' },
      { status: 500 }
    );
  }
}