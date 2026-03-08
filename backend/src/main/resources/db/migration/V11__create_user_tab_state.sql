CREATE TABLE user_tab_state (
    user_id    BIGINT    PRIMARY KEY REFERENCES users(id),
    tab_state  TEXT      NOT NULL DEFAULT '{"tabs":[],"activeTabId":null}',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
