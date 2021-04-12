import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Loader from "../components/Loader";
import NewPetModal from "../components/NewPetModal";
import PetsList from "../components/PetsList";

const ADD_PET = gql`
  mutation AddPet($pet: NewPetInput!) {
    addPet(input: $pet) {
      id
      img
      name
      type
    }
  }
`;

const FETCH_ALL_PETS = gql`
  query FetchAllPets {
    pets {
      id
      img
      name
      type
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const [addPet, addedPet] = useMutation(ADD_PET, {
    update(cache, { data: { addPet } }) {
      const allPets = cache.readQuery({ query: FETCH_ALL_PETS });
      cache.writeQuery({
        query: FETCH_ALL_PETS,
        data: { pets: [addPet, ...allPets] },
      });
    },
  });
  const fetchedPets = useQuery(FETCH_ALL_PETS);

  const onSubmit = input => {
    addPet({
      variables: { pet: input },
    });
    setModal(false);
  };

  if (fetchedPets.loading || addedPet.loading) {
    return <Loader />;
  }

  if (fetchedPets.error || addedPet.error) {
    return <p>Error</p>;
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>
          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={fetchedPets.data.pets} />
      </section>
    </div>
  );
}
