import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Loader from "../components/Loader";
import NewPetModal from "../components/NewPetModal";
import PetsList from "../components/PetsList";

const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    img
    name
    owner {
      age @client
      id
    }
    type
    __typename
  }
`;

const ADD_PET = gql`
  mutation AddPet($pet: NewPetInput!) {
    addPet(input: $pet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

const FETCH_ALL_PETS = gql`
  query FetchAllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const [addPet, addedPet] = useMutation(ADD_PET, {
    // update runs after the mutation response has come back
    update(cache, { data: { addPet } }) {
      const { pets } = cache.readQuery({ query: FETCH_ALL_PETS });
      cache.writeQuery({
        query: FETCH_ALL_PETS,
        data: { pets: [addPet, ...pets] },
      });
    },
  });
  const fetchedPets = useQuery(FETCH_ALL_PETS);

  const onSubmit = input => {
    addPet({
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: "",
          img: "",
          name: input.name,
          type: input.type,
        },
      },
      variables: { pet: input },
    });
    setModal(false);
  };

  if (fetchedPets.loading) {
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
