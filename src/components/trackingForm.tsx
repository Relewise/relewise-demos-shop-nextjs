"use client";

import { Tracking } from "@/stores/tracking";
import { useState } from "react";

interface TrackingFormProps {
  tracking: Tracking;
  setTracking: (tracking: Tracking) => void;
}

export default function TrackingForm(props: TrackingFormProps) {
  return (
    <div>
      <h2 className="mb-8 text-4xl">Behavioral tracking</h2>

      <label className="mb-6 flex items-center">
        <input
          type="checkbox"
          checked={props.tracking.enabled}
          className="accent-brand-500 mr-3 h-5 w-5"
          onChange={() => {
            const enabled = !props.tracking.enabled;
            props.setTracking({
              ...props.tracking,
              enabled
            });
          }}
        />
        Tracking enabled
      </label>

      <p>
        When tracking is enabled, all your actions are tracked to Relewise to give you a personal
        experience
      </p>

      <hr className="my-10" />

      <div className="flex gap-5">
        <button
          className="bg-gray-500 text-white"
          onClick={() => {
            const temporaryId = crypto.randomUUID();
            props.setTracking({
              ...props.tracking,
              temporaryId
            });
          }}
        >
          Reset Personal Tracking
        </button>
        <div className="p-3 bg-zinc-300 rounded leading-tight font-mono flex-grow">
          Temporary Id: <strong> {props.tracking.temporaryId} </strong>
        </div>
      </div>
    </div>
  );
}
