// Define admin passwords
const ADMIN_PASSWORDS = {
  'ADMIN_DELETE_PASSWORD': '010203',
  'ADMIN_EXPORT_PASSWORD': '010203',
  'ADMIN_EDIT_PASSWORD': '010203'
};

export const handler = async (event: any) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { name } = body;

    if (!name) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'Secret name is required' })
      };
    }

    // Get the password from our defined constants
    const secret = ADMIN_PASSWORDS[name as keyof typeof ADMIN_PASSWORDS];
    
    if (!secret) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: `Secret ${name} not found` })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ [name]: secret })
    };
  } catch (error) {
    console.error('Error in get-secret function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};