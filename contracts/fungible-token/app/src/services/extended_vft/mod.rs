use super::vft;
use super::vft::Storage;
use collections::HashSet;
use gstd::{exec, msg};
use sails_rs::{gstd::service, prelude::*};
mod funcs;
use crate::services;
pub(crate) mod utils;
use crate::services::extended_vft::utils::*;

pub struct ExtendedVftData {
    additional_meta: AdditionalMeta,
    minters: HashSet<ActorId>,
    burners: HashSet<ActorId>,
    admins: HashSet<ActorId>,
}

static mut EXTENDED_VFT: Option<ExtendedVftData> = None;

#[derive(Clone, Debug, Encode, Decode, TypeInfo)]
pub enum Event {
    Minted {
        to: ActorId,
        value: U256,
    },
    Burned {
        from: ActorId,
        value: U256,
    },
    Killed {
        inheritor: ActorId,
    },
    TransferredToUsers {
        from: ActorId,
        to: Vec<ActorId>,
        value: U256,
    },
    DescriptionChanged {
        new_description: String,
    },
    ImageLinkChanged {
        new_image_link: String,
    },
    ExternalLinksChanged {
        new_external_links: ExternalLinks,
    },
}

#[derive(Clone)]
pub struct ExtendedVft {
    vft: vft::Service,
}

impl ExtendedVft {
    pub fn seed(init: Init) -> Self {
        if init.initial_supply > init.max_supply {
            panic!("SupplyError");
        }

        if init.description.chars().count() > 500 {
            panic!("DescriptionError");
        }

        unsafe {
            EXTENDED_VFT = Some(ExtendedVftData {
                additional_meta: AdditionalMeta {
                    description: init.description,
                    external_links: init.external_links,
                    max_supply: init.max_supply,
                },
                admins: [init.admin_id].into(),
                minters: [init.admin_id].into(),
                burners: [init.admin_id].into(),
            });
        };
        ExtendedVft {
            vft: <vft::Service>::seed(
                init.name,
                init.symbol,
                init.decimals,
                init.admin_id,
                init.initial_supply,
            ),
        }
    }

    pub fn get_mut(&mut self) -> &'static mut ExtendedVftData {
        unsafe {
            EXTENDED_VFT
                .as_mut()
                .expect("Extended vft is not initialized")
        }
    }
    pub fn get(&self) -> &'static ExtendedVftData {
        unsafe {
            EXTENDED_VFT
                .as_ref()
                .expect("Extended vft is not initialized")
        }
    }
}

#[service(extends = vft::Service, events = Event)]
impl ExtendedVft {
    pub fn new() -> Self {
        Self {
            vft: vft::Service::new(),
        }
    }
    pub fn mint(&mut self, to: ActorId, value: U256) -> bool {
        if !self.get().minters.contains(&msg::source()) {
            panic!("Not allowed to mint")
        };

        let mutated = services::utils::panicking(|| {
            funcs::mint(
                Storage::balances(),
                Storage::total_supply(),
                &self.get().additional_meta,
                to,
                value,
            )
        });
        if mutated {
            let _ = self.notify_on(Event::Minted { to, value });
        }
        mutated
    }

    pub fn burn(&mut self, from: ActorId, value: U256) -> bool {
        if !self.get().burners.contains(&msg::source()) {
            panic!("Not allowed to burn")
        };

        let mutated = services::utils::panicking(|| {
            funcs::burn(Storage::balances(), Storage::total_supply(), from, value)
        });
        if mutated {
            let _ = self.notify_on(Event::Burned { from, value });
        }
        mutated
    }

    pub fn transfer_to_users(&mut self, to: Vec<ActorId>, value: U256) -> bool {
        let from = msg::source();

        let mutated = services::utils::panicking(|| {
            funcs::transfer_to_users(Storage::balances(), from, &to, value)
        });

        if mutated {
            let _ = self.notify_on(Event::TransferredToUsers { from, to, value });
        }

        mutated
    }

    pub fn change_description(&mut self, new_description: String) {
        self.ensure_is_admin();
        self.get_mut()
            .additional_meta
            .description
            .clone_from(&new_description);
        let _ = self.notify_on(Event::DescriptionChanged { new_description });
    }

    pub fn change_image_link(&mut self, new_image_link: String) {
        self.ensure_is_admin();
        self.get_mut()
            .additional_meta
            .external_links
            .image
            .clone_from(&new_image_link);
        let _ = self.notify_on(Event::ImageLinkChanged { new_image_link });
    }

    pub fn change_external_links(&mut self, new_external_links: ExternalLinks) {
        self.ensure_is_admin();
        self.get_mut().additional_meta.external_links = new_external_links.clone();
        let _ = self.notify_on(Event::ExternalLinksChanged { new_external_links });
    }

    pub fn kill(&mut self, inheritor: ActorId) {
        self.ensure_is_admin();
        let _ = self.notify_on(Event::Killed { inheritor });
        exec::exit(inheritor)
    }

    pub fn grant_admin_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().admins.insert(to);
    }

    pub fn grant_minter_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().minters.insert(to);
    }
    pub fn grant_burner_role(&mut self, to: ActorId) {
        self.ensure_is_admin();
        self.get_mut().burners.insert(to);
    }

    pub fn revoke_minter_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().minters.remove(&from);
    }
    pub fn revoke_burner_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().burners.remove(&from);
    }
    pub fn revoke_admin_role(&mut self, from: ActorId) {
        self.ensure_is_admin();
        self.get_mut().admins.remove(&from);
    }
    pub fn minters(&self) -> Vec<ActorId> {
        self.get().minters.clone().into_iter().collect()
    }

    pub fn burners(&self) -> Vec<ActorId> {
        self.get().burners.clone().into_iter().collect()
    }

    pub fn admins(&self) -> Vec<ActorId> {
        self.get().admins.clone().into_iter().collect()
    }

    pub fn description(&self) -> &'static str {
        &self.get().additional_meta.description
    }

    pub fn external_links(&self) -> &'static ExternalLinks {
        &self.get().additional_meta.external_links
    }

    pub fn max_supply(&self) -> &'static U256 {
        &self.get().additional_meta.max_supply
    }
}

impl ExtendedVft {
    fn ensure_is_admin(&self) {
        if !self.get().admins.contains(&msg::source()) {
            panic!("Not admin")
        };
    }
}
impl AsRef<vft::Service> for ExtendedVft {
    fn as_ref(&self) -> &vft::Service {
        &self.vft
    }
}
