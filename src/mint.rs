use crate::*;
use near_sdk::serde::Serialize;
use serde_json::json;

#[derive(Serialize)]
struct Extra {
    background: String,
    face: String,
    hair: String,
    eyes: String,
    nose: String,
    mouth: String,
    glasses: String,
    beard: String,
}

trait ExtraToString {
    fn new() -> Self;
    fn convert_to_string(&self) -> String;
}

// Credit goes to Matt Lockyer
// https://gist.github.com/mattlockyer/4821401b74cfef788642316d6279f4fc
/* fn random_u128() -> u128 {
    let random_seed = env::random_seed(); // len 32
                                          // using first 16 bytes (doesn't affect randomness)
    as_u128(random_seed.get(..16).unwrap())
} */

fn as_u128(arr: &[u8]) -> u128 {
    ((arr[0] as u128) << 0)
        + ((arr[1] as u128) << 8)
        + ((arr[2] as u128) << 16)
        + ((arr[3] as u128) << 24)
        + ((arr[4] as u128) << 32)
        + ((arr[5] as u128) << 40)
        + ((arr[6] as u128) << 48)
        + ((arr[7] as u128) << 56)
        + ((arr[8] as u128) << 64)
        + ((arr[9] as u128) << 72)
        + ((arr[10] as u128) << 80)
        + ((arr[11] as u128) << 88)
        + ((arr[12] as u128) << 96)
        + ((arr[13] as u128) << 104)
        + ((arr[14] as u128) << 112)
        + ((arr[15] as u128) << 120)
}
// https://gist.github.com/mattlockyer/4821401b74cfef788642316d6279f4fc

// However, the random number generator above returns the same number when called in quick succession so I will have to improvise.random_u128()
fn random_u128_sequence(previous_rand: &mut u128) -> u128 {
    let mut temp = *previous_rand;
    let mut seed: Vec<u8> = vec![];

    if *previous_rand > 0 {
        for _index in 0..16 {
            let new_digit = temp % 10;
            seed.push(new_digit.try_into().unwrap());
            temp /= 10;
            if temp <= 0 {
                temp = *previous_rand
            };
        }
    } else {
        seed = env::random_seed();
    }

    let result = as_u128(seed.get(..16).unwrap());
    *previous_rand = result;
    result
}

fn wrap_u128_to_string(val: u128, upper_bound: u128) -> String {
    format!("{}", val % upper_bound)
}

impl ExtraToString for Extra {
    fn new() -> Self {
        let mut previous_rand: u128 = 0;

        Self {
            background: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            face: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            hair: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            eyes: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            nose: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            mouth: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            glasses: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
            beard: wrap_u128_to_string(random_u128_sequence(&mut previous_rand), 256),
        }
    }

    fn convert_to_string(&self) -> String {
        // serde_json fails on u128 but works with a String representing a u128.
        // This is all grossly inefficient.
        let json = json!(&self);
        json.to_string()

        // Previous mundane implementation
        /* format!(
            "{{\"background\": {}, \"face\": {}, \"hair\": {}, \"eyes\": {}, \"nose\": {}, \"mouth\": {}, \"glasses\": {}, \"beard\": {}}}",
            self.background, self.face, self.hair, self.eyes, self.nose, self.mouth, self.glasses, self.beard
        ) */
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        //we add an optional parameter for perpetual royalties
        perpetual_royalties: Option<HashMap<AccountId, u32>>,
    ) {
        //measure the initial storage being used on the contract
        let initial_storage_usage = env::storage_usage();

        // create a royalty map to store in the token
        let mut royalty = HashMap::new();

        // if perpetual royalties were passed into the function:
        if let Some(perpetual_royalties) = perpetual_royalties {
            //make sure that the length of the perpetual royalties is below 7 since we won't have enough GAS to pay out that many people
            assert!(
                perpetual_royalties.len() < 7,
                "Cannot add more than 6 perpetual royalty amounts"
            );

            //iterate through the perpetual royalties and insert the account and amount in the royalty map
            for (account, amount) in perpetual_royalties {
                royalty.insert(account, amount);
            }
        }

        //specify the token struct that contains the owner ID
        let token = Token {
            //set the owner ID equal to the receiver ID passed into the function
            owner_id: receiver_id,
            //we set the approved account IDs to the default value (an empty map)
            approved_account_ids: Default::default(),
            //the next approval ID is set to 0
            next_approval_id: 0,
            //the map of perpetual royalties for the token (The owner will get 100% - total perpetual royalties)
            royalty,
        };

        //insert the token ID and token struct and make sure that the token doesn't exist
        assert!(
            self.tokens_by_id.insert(&token_id, &token).is_none(),
            "Token already exists"
        );

        let extra = Extra::new();

        let metadata = TokenMetadata {
            title: None,
            description: None,
            media: None,
            media_hash: None,
            copies: Some(1),
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            reference: None,
            reference_hash: None,
            extra: Some(extra.convert_to_string()),
        };

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_id, &metadata);

        //call the internal method for adding the token to the owner
        self.internal_add_token_to_owner(&token.owner_id, &token_id);

        // Construct the mint log as per the events standard.
        let nft_mint_log: EventLog = EventLog {
            // Standard name ("nep171").
            standard: NFT_STANDARD_NAME.to_string(),
            // Version of the standard ("nft-1.0.0").
            version: NFT_METADATA_SPEC.to_string(),
            // The data related with the event stored in a vector.
            event: EventLogVariant::NftMint(vec![NftMintLog {
                // Owner of the token.
                owner_id: token.owner_id.to_string(),
                // Vector of token IDs that were minted.
                token_ids: vec![token_id.to_string()],
                // An optional memo to include.
                memo: None,
            }]),
        };

        // Log the serialized json.
        env::log_str(&nft_mint_log.to_string());

        //calculate the required storage which was the used - initial
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        refund_deposit(required_storage_in_bytes);
    }
}
