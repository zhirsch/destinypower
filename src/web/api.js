var API = function () {
    const BUNGIE_NET_ROOT_URL = "https://www.bungie.net/Platform";

    var ApiKey = null;
    var AccessToken = null;

    class ApiError extends Error {
        constructor(error, error_description) {
            super(error_description + " (" + error + ")");
            this.name = "ApiError";
        }
    }

    function validateApiResponse(response) {
        if (typeof response.error !== "undefined") {
            throw new ApiError(response.error, response.error_description);
        }
        if (typeof response.ErrorCode !== "undefined" && response.ErrorCode != 1) {
            throw new ApiError(response.ErrorStatus, response.Message);
        }
        return Promise.resolve(response);
    }


    function get(url) {
        return fetch(BUNGIE_NET_ROOT_URL + url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "X-API-Key": ApiKey,
                "Authorization": "Bearer " + AccessToken,
            },
        });
    }

    function post(url, body) {
        return fetch(BUNGIE_NET_ROOT_URL + url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body,
        })
    }

    return {
        SetAccessToken: function (access_token) {
            AccessToken = access_token;
        },

        SetApiKey: function (api_key) {
            ApiKey = api_key;
        },

        Login: function (client_id, code) {
            var args = {
                "grant_type": "authorization_code",
                "client_id": client_id,
                "code": code,
            }
            return post("/App/OAuth/token/", $.param(args))
                .then(response => response.json())
                .then(validateApiResponse);
        },

        UserGetMembershipDataForCurrentUser: function () {
            return get("/User/GetMembershipsForCurrentUser/")
                .then(response => response.json())
                .then(validateApiResponse);
        },

        Destiny2GetProfile: function (membershipType, membershipId) {
            return get("/Destiny2/" + membershipType + "/Profile/" + membershipId + "/?components=200,201,205,300")
                .then(response => response.json())
                .then(validateApiResponse);
        },

        Destiny2GetDestinyEntityDefinition: function (entityType, hashIdentifier) {
            return get("/Destiny2/Manifest/" + entityType + "/" + hashIdentifier + "/")
                .then(response => response.json())
                .then(validateApiResponse);
        },
    }
}();