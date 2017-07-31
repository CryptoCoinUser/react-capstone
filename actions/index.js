import 'isomorphic-fetch';


export const FETCH_LATEST_BLOCK_SUCCESS = 'FETCH_LATEST_BLOCK_SUCCESS';
export const fetchLatestBlockSuccess = (response) => ({
    type: FETCH_LATEST_BLOCK_SUCCESS,
    repository,
    description,
    html_url
});

export const FETCH_LATEST_BLOCK_ERROR= 'FETCH_LATEST_BLOCK_ERROR';
export const fetchLatestBlockError = (error) => ({
    type: FETCH_LATEST_BLOCK_ERROR,
    repository,
    error
});


export const fetchLatestBlock = repository => dispatch => {
    const url = `https:\//api.blockcypher.com/v1/btc/main`;
    return fetch(url).then(response => {
        if (!response.ok) {
            const error = new Error(response.statusText)
            error.response = response
            throw error;
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.html_url);
        return dispatch(fetchLatestBlockSuccess(repository, data.description, data.html_url))
        
        }
    )
    .catch(error =>
        dispatch(fetchLatestBlockError(repository, error))
    );
};