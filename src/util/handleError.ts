import { ProblemDetailsError } from "@relewise/client";
import { toast } from "react-toastify";

export default function handleRelewiseClientError(error: ProblemDetailsError) {

    let text = 'Something went wrong while calling Relewise.';

    if (error.details && error.details.status !== 200) {
        if (error.details.status === 400)  {
            text = 'The App does not support the expected scenario. Contact Relewise for help.';
        }

        if (error.details.status === 401) {
            text = 'There was an error when authenticating agains Relewise. Contact Relewise for help.';
        }

        if (error.details.status === 404)  {
            text = 'No products could be found. Contact Relewise for help.';
        }

        if (error.details.status === 500)  {
            text = 'There was an unexpected error on your dataset. Contact Relewise for help.';
        }
    }
    
    toast.error(text);
}